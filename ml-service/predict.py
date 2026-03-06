"""
================================================================================
Solar Plant Predictive Maintenance — Inference API
================================================================================

Takes a simple JSON input describing an inverter's current state and returns
a rich risk assessment with prediction, risk score, contributing factors,
and recommended actions.

Usage:
    # Interactive mode (prompts for input):
    python predict.py

    # Pipe JSON directly:
    echo '{"plant_id":"Plant_1","inverter_id":"INV-5","mean_power":1400}' | python predict.py

    # From file:
    python predict.py --input sample_input.json

    # Batch mode (JSON array):
    python predict.py --input batch_inputs.json

    # As importable module:
    from predict import predict_failure
    result = predict_failure({"plant_id": "Plant_1", "mean_power": 1400, ...})
================================================================================
"""

import json
import sys
import argparse
import warnings
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import joblib

warnings.filterwarnings("ignore")

# ──────────────────────────────────────────────────────────────────────────────
# Load Model Artifacts
# ──────────────────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "solar_predictive_maintenance_model.pkl"
SCALER_PATH = BASE_DIR / "scaler.pkl"
FEATURES_PATH = BASE_DIR / "feature_columns.pkl"

_model = joblib.load(MODEL_PATH)
_scaler = joblib.load(SCALER_PATH)
_features = joblib.load(FEATURES_PATH)


# ──────────────────────────────────────────────────────────────────────────────
# Input → Feature Mapping
# ──────────────────────────────────────────────────────────────────────────────
#
# The user provides ~10–15 intuitive fields. We map them to the model's
# 51 engineered features using domain knowledge about what each feature
# represents in a solar plant context.
#
# INPUT FIELDS (all optional, sensible defaults applied):
#   plant_id        — "Plant_1", "Plant_2", "Plant_3" (for context only)
#   inverter_id     — "INV-0", "INV-5" etc. (for context only)
#   mean_power      — Average inverter AC power output in Watts (e.g. 50000)
#   std_power       — Std deviation of recent power readings (e.g. 2000)
#   max_power       — Max recent power reading (e.g. 55000)
#   min_power       — Min recent power reading (e.g. 45000)
#   mean_temp       — Average inverter temperature °C (e.g. 35)
#   max_temp        — Max recent temperature °C (e.g. 42)
#   mean_voltage    — Average PV string voltage V (e.g. 600)
#   mean_current    — Average PV string current A (e.g. 10)
#   ambient_temp    — Ambient/outdoor temperature °C (e.g. 30)
#   alarm_count     — Number of alarms in the past hour (e.g. 0)
#   hour            — Hour of day 0–23 (e.g. 13)
#   grid_freq       — Grid frequency Hz (e.g. 50.0)
#   power_factor    — Grid power factor (e.g. 0.98)
#   kwh_today       — Energy produced today kWh (e.g. 150)
#   kwh_total       — Lifetime energy kWh (e.g. 500000)
#   op_state        — Inverter operating state code (e.g. 5120)
#   n_strings       — Number of active PV strings (e.g. 9)
# ──────────────────────────────────────────────────────────────────────────────


def _map_input_to_features(user_input: dict) -> pd.DataFrame:
    """
    Convert user-friendly input dict to the model's 51-feature DataFrame.

    Strategy:
    - Direct mappings where input fields match model features
    - Derived features computed from the inputs (e.g. power_ratio = power / rolling_mean)
    - Sensible defaults for fields the user didn't provide
    """
    # ── Extract user inputs with defaults ──
    mean_power = float(user_input.get("mean_power", 0))
    std_power = float(user_input.get("std_power", 0))
    max_power = float(user_input.get("max_power", mean_power * 1.1 if mean_power > 0 else 0))
    min_power = float(user_input.get("min_power", mean_power * 0.9 if mean_power > 0 else 0))
    mean_temp = float(user_input.get("mean_temp", 35))
    max_temp = float(user_input.get("max_temp", mean_temp))
    mean_voltage = float(user_input.get("mean_voltage", 600))
    mean_current = float(user_input.get("mean_current", 10))
    ambient_temp = float(user_input.get("ambient_temp", 30))
    alarm_count = int(user_input.get("alarm_count", 0))
    hour = int(user_input.get("hour", 12))
    grid_freq = float(user_input.get("grid_freq", 50.0))
    power_factor = float(user_input.get("power_factor", 0.98))
    kwh_today = float(user_input.get("kwh_today", 0))
    kwh_total = float(user_input.get("kwh_total", 500000))
    op_state = float(user_input.get("op_state", 5120 if mean_power > 0 else 0))
    n_strings = int(user_input.get("n_strings", 9))

    # ── Derived calculations ──
    is_daytime = 1 if 6 <= hour <= 18 else 0
    month = int(user_input.get("month", 6))
    day_of_week = int(user_input.get("day_of_week", 2))

    # Temperature statistics
    temp_std = (max_temp - mean_temp) / 2.0 if max_temp > mean_temp else 1.0
    temp_above_ambient = mean_temp - ambient_temp

    # Power ratio: how current power compares to its rolling mean
    power_rolling_mean = mean_power  # In a single-snapshot, rolling mean ≈ mean
    power_ratio = 1.0 if mean_power <= 0 or power_rolling_mean <= 10 else mean_power / power_rolling_mean

    # Voltage/current imbalance (if only mean provided, assume low imbalance)
    pv_current_imbalance = float(user_input.get("current_imbalance", 0.05))
    pv_voltage_imbalance = float(user_input.get("voltage_imbalance", 0.01))

    # Power ramp (rate of change) — assume moderate if not provided
    power_ramp = float(user_input.get("power_ramp", 0))

    # kWh rate
    kwh_rate = kwh_today / hour if hour > 0 else 0

    # Meter power (approximate from inverter power, converted W → kW)
    meter_active_power = mean_power / 1000.0

    # ── Build the 51-feature vector ──
    feature_dict = {
        # Core inverter metrics
        "power": mean_power,
        "pv1_power": mean_power * 0.5,             # Approximate split across PV inputs
        "pv2_power": mean_power * 0.01,             # pv2_power is small in training data
        "temp": mean_temp,
        "kwh_today": kwh_today,
        "kwh_total": kwh_total,
        "op_state": op_state,
        "limit_percent": 100.0,

        # Voltage / current
        "pv1_voltage": mean_voltage,
        "pv1_current": mean_current,
        "pv2_voltage": mean_voltage * 0.5,
        "pv2_current": mean_current * 0.3,
        "v_ab": 0.0,                               # Phase voltages (Plant 1 only)
        "v_bc": 0.0,
        "v_ca": 0.0,

        # Aggregated PV string stats
        "pv_current_mean": mean_current,
        "pv_current_std": mean_current * pv_current_imbalance,
        "pv_voltage_mean": mean_voltage,
        "pv_voltage_std": mean_voltage * pv_voltage_imbalance,
        "n_active_pv_strings": float(n_strings),

        # SMU string monitoring
        "smu_current_mean": mean_current * 0.9,
        "smu_current_std": mean_current * 0.03,

        # Environmental / grid
        "ambient_temp": ambient_temp,
        "meter_active_power": meter_active_power,
        "meter_kwh_total": kwh_total * 0.95,
        "grid_freq": grid_freq,
        "grid_pf": power_factor,
        "inverter_freq": 0.0,

        # Temporal
        "hour": hour,
        "day_of_week": day_of_week,
        "month": month,
        "is_daytime": is_daytime,

        # Rolling statistics
        "power_rolling_mean": power_rolling_mean,
        "power_rolling_std": std_power,
        "power_rolling_min": min_power,
        "power_rolling_max": max_power,
        "temp_rolling_mean": mean_temp,
        "temp_rolling_std": temp_std,

        # Rate of change
        "power_ramp": power_ramp,
        "power_ramp_abs": abs(power_ramp),
        "temp_delta": 0.0,

        # Ratios
        "power_ratio": power_ratio,
        "phase_voltage_imbalance": 0.0,
        "pv_current_imbalance": pv_current_imbalance,
        "pv_voltage_imbalance": pv_voltage_imbalance,

        # Efficiency
        "kwh_rate": kwh_rate,
        "temp_above_ambient": temp_above_ambient,
        "power_meter_ratio": 1.0 if meter_active_power > 1 else 0.0,

        # Alarm-derived
        "alarm_count_rolling": float(alarm_count),
        "op_state_changed": 0,
        "freq_deviation": abs(grid_freq - 50.0),
    }

    # Ensure correct column order matching the trained model
    row = {f: feature_dict.get(f, 0.0) for f in _features}
    return pd.DataFrame([row], columns=_features)


# ──────────────────────────────────────────────────────────────────────────────
# Risk Assessment Logic
# ──────────────────────────────────────────────────────────────────────────────

# Thresholds for risk levels
RISK_THRESHOLDS = {
    "LOW": (0.0, 0.3),
    "MEDIUM": (0.3, 0.6),
    "HIGH": (0.6, 0.85),
    "CRITICAL": (0.85, 1.0),
}

# Human-readable explanations for detected anomalies
FACTOR_RULES = [
    {
        "check": lambda inp: inp.get("alarm_count", 0) > 0,
        "message": "Active alarm codes detected on inverter",
        "severity": 3,
    },
    {
        "check": lambda inp: inp.get("mean_temp", 35) > 55,
        "message": "Inverter temperature critically high",
        "severity": 3,
    },
    {
        "check": lambda inp: inp.get("mean_temp", 35) > 45,
        "message": "Inverter temperature higher than normal",
        "severity": 2,
    },
    {
        "check": lambda inp: (inp.get("mean_temp", 35) - inp.get("ambient_temp", 30)) > 25,
        "message": "Excessive temperature rise above ambient",
        "severity": 2,
    },
    {
        "check": lambda inp: inp.get("std_power", 0) > inp.get("mean_power", 1) * 0.5 and inp.get("mean_power", 0) > 100,
        "message": "High power output variance — possible intermittent fault",
        "severity": 2,
    },
    {
        "check": lambda inp: inp.get("mean_power", 0) < 500 and 8 <= inp.get("hour", 12) <= 16,
        "message": "Very low power output during peak sun hours",
        "severity": 3,
    },
    {
        "check": lambda inp: inp.get("mean_power", 0) < 5000 and 10 <= inp.get("hour", 12) <= 14,
        "message": "Below-expected power generation at midday",
        "severity": 1,
    },
    {
        "check": lambda inp: abs(inp.get("grid_freq", 50.0) - 50.0) > 0.5,
        "message": "Grid frequency deviation detected",
        "severity": 2,
    },
    {
        "check": lambda inp: inp.get("current_imbalance", 0.05) > 0.3,
        "message": "PV string current imbalance detected — possible string fault",
        "severity": 2,
    },
    {
        "check": lambda inp: inp.get("voltage_imbalance", 0.01) > 0.1,
        "message": "Voltage fluctuation detected across PV strings",
        "severity": 2,
    },
    {
        "check": lambda inp: inp.get("max_temp", 0) > 65,
        "message": "Peak temperature exceeds safe operating limit",
        "severity": 3,
    },
    {
        "check": lambda inp: inp.get("power_factor", 0.98) < 0.85,
        "message": "Low power factor — reactive power issue",
        "severity": 1,
    },
    {
        "check": lambda inp: inp.get("mean_power", 0) > 0 and inp.get("std_power", 0) > 0
                   and inp.get("std_power", 0) / max(inp.get("mean_power", 1), 1) > 0.6,
        "message": "Power deviation across inverter readings",
        "severity": 2,
    },
]

# Recommended actions by risk level
RECOMMENDED_ACTIONS = {
    "LOW": "No immediate action required. Continue routine monitoring.",
    "MEDIUM": "Monitor inverter temperature and inspect PV string connections. Schedule preventive check within 48 hours.",
    "HIGH": "Immediate inspection recommended. Check inverter cooling system, PV string integrity, and alarm logs.",
    "CRITICAL": "URGENT: Dispatch maintenance crew immediately. Inverter at risk of shutdown or damage. Isolate if necessary.",
}

# Status messages by risk level
STATUS_MESSAGES = {
    "LOW": "Inverter operating within normal parameters",
    "MEDIUM": "Possible inverter degradation detected",
    "HIGH": "Inverter anomaly detected — performance degradation likely",
    "CRITICAL": "Inverter failure imminent — immediate intervention required",
}


def _get_risk_level(score: float) -> str:
    """Map a 0–1 risk score to a categorical risk level."""
    for level, (low, high) in RISK_THRESHOLDS.items():
        if low <= score < high:
            return level
    return "CRITICAL"


def _get_top_factors(user_input: dict, max_factors: int = 5) -> list:
    """Determine which risk factors apply based on user input."""
    triggered = []
    for rule in FACTOR_RULES:
        try:
            if rule["check"](user_input):
                triggered.append((rule["severity"], rule["message"]))
        except (KeyError, TypeError, ZeroDivisionError):
            continue

    # Sort by severity (highest first), return messages only
    triggered.sort(key=lambda x: x[0], reverse=True)
    messages = [msg for _, msg in triggered[:max_factors]]

    # If nothing triggered but risk is still elevated, add a generic note
    if not messages:
        messages = ["No specific anomaly detected — prediction based on overall telemetry pattern"]

    return messages


# ──────────────────────────────────────────────────────────────────────────────
# Main Prediction Function
# ──────────────────────────────────────────────────────────────────────────────


def predict_failure(user_input: dict) -> dict:
    """
    Run inference on a single inverter reading.

    Args:
        user_input: Dict with keys like mean_power, std_power, mean_temp, etc.

    Returns:
        Dict with prediction, risk_score, status, top_factors,
        recommended_action, and the original input echoed back.
    """
    # Map user input → 51 model features
    X = _map_input_to_features(user_input)

    # Scale and predict
    X_scaled = _scaler.transform(X)
    risk_score = float(_model.predict_proba(X_scaled)[0, 1])
    risk_level = _get_risk_level(risk_score)
    prediction_label = int(_model.predict(X_scaled)[0])

    # Build response
    result = {
        "input": {
            "plant_id": user_input.get("plant_id", "Unknown"),
            "inverter_id": user_input.get("inverter_id", "Unknown"),
            "mean_power": user_input.get("mean_power", 0),
            "std_power": user_input.get("std_power", 0),
            "mean_temp": user_input.get("mean_temp", 35),
            "max_temp": user_input.get("max_temp", user_input.get("mean_temp", 35)),
            "mean_voltage": user_input.get("mean_voltage", 600),
            "ambient_temp": user_input.get("ambient_temp", 30),
            "alarm_count": user_input.get("alarm_count", 0),
            "hour": user_input.get("hour", 12),
        },
        "output": {
            "prediction": risk_level + " RISK",
            "risk_score": round(risk_score, 4),
            "failure_predicted": bool(prediction_label),
            "status": STATUS_MESSAGES[risk_level],
            "top_factors": _get_top_factors(user_input),
            "recommended_action": RECOMMENDED_ACTIONS[risk_level],
        },
    }

    return result


def predict_batch(inputs: list) -> list:
    """Run inference on a list of inverter readings."""
    return [predict_failure(inp) for inp in inputs]


# ──────────────────────────────────────────────────────────────────────────────
# CLI Interface
# ──────────────────────────────────────────────────────────────────────────────

SAMPLE_INPUTS = [
    {
        "plant_id": "Plant_1",
        "inverter_id": "INV-5",
        "mean_power": 1400,
        "std_power": 900,
        "mean_temp": 60,
        "max_temp": 72,
        "mean_voltage": 385,
        "ambient_temp": 36,
        "alarm_count": 1,
        "hour": 13,
    },
    {
        "plant_id": "Plant_2",
        "inverter_id": "INV-0",
        "mean_power": 50000,
        "std_power": 1500,
        "mean_temp": 36,
        "max_temp": 39,
        "mean_voltage": 610,
        "ambient_temp": 32,
        "alarm_count": 0,
        "hour": 11,
    },
    {
        "plant_id": "Plant_3",
        "inverter_id": "INV-0",
        "mean_power": 200,
        "std_power": 50,
        "mean_temp": 75,
        "max_temp": 82,
        "mean_voltage": 580,
        "ambient_temp": 38,
        "alarm_count": 5,
        "hour": 14,
    },
]


def main():
    parser = argparse.ArgumentParser(
        description="Solar Plant Predictive Maintenance — Inference"
    )
    parser.add_argument(
        "--input", "-i",
        type=str,
        help="Path to JSON file with input(s). Can be a single object or array.",
    )
    parser.add_argument(
        "--demo",
        action="store_true",
        help="Run with built-in sample inputs to demonstrate all risk levels.",
    )
    args = parser.parse_args()

    # ── Determine input source ──
    if args.demo:
        inputs = SAMPLE_INPUTS
        print("\n🔆 Running demo with 3 sample scenarios ...\n")
    elif args.input:
        with open(args.input, "r") as f:
            data = json.load(f)
        inputs = data if isinstance(data, list) else [data]
    elif not sys.stdin.isatty():
        # Piped input
        data = json.load(sys.stdin)
        inputs = data if isinstance(data, list) else [data]
    else:
        # Interactive mode
        print("\n🔆 Solar Plant Predictive Maintenance — Inference")
        print("=" * 55)
        print("\nEnter inverter reading as JSON (or type 'demo' for examples):\n")
        raw = input("> ").strip()
        if raw.lower() == "demo":
            inputs = SAMPLE_INPUTS
        else:
            data = json.loads(raw)
            inputs = data if isinstance(data, list) else [data]

    # ── Run predictions ──
    for i, inp in enumerate(inputs):
        result = predict_failure(inp)

        # Pretty print
        print("─" * 60)
        print(f"  INVERTER: {result['input']['inverter_id']}  │  "
              f"PLANT: {result['input']['plant_id']}")
        print("─" * 60)
        print(f"\n  📊 Input:")
        for k, v in result["input"].items():
            if k not in ("plant_id", "inverter_id"):
                print(f"     {k:20s}: {v}")

        out = result["output"]
        risk = out["prediction"]
        score = out["risk_score"]

        # Color-coded risk indicator
        if "CRITICAL" in risk:
            icon = "🔴"
        elif "HIGH" in risk:
            icon = "🟠"
        elif "MEDIUM" in risk:
            icon = "🟡"
        else:
            icon = "🟢"

        print(f"\n  {icon} Prediction:  {risk}")
        print(f"  📈 Risk Score:  {score}")
        print(f"  📋 Status:      {out['status']}")
        print(f"\n  ⚠️  Top Factors:")
        for factor in out["top_factors"]:
            print(f"     • {factor}")
        print(f"\n  🔧 Action:      {out['recommended_action']}")
        print()

    # ── Also dump full JSON to stdout ──
    if len(inputs) == 1:
        full_output = predict_failure(inputs[0])
    else:
        full_output = predict_batch(inputs)

    print("═" * 60)
    print("  FULL JSON OUTPUT")
    print("═" * 60)
    print(json.dumps(full_output, indent=2))


if __name__ == "__main__":
    main()
