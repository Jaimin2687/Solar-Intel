/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Carbon Impact Dashboard
 * ─────────────────────────────────────────────────────────
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, pageTransition } from "@/lib/motion";
import { fetchAnalytics, fetchLiveEnergy } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, DonutChart, BarChart } from "@tremor/react";
import {
  Leaf,
  TreePine,
  Droplets,
  Wind,
  Fuel,
  TrendingUp,
  Globe2,
  Factory,
  Car,
  Home,
  Lightbulb,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TranslatedText } from "@/components/ui/translated-text";

/* ── Constants for carbon calculations ── */
const CO2_PER_KWH = 0.82; // kg CO₂ per kWh (India grid average)
const TREES_PER_TON_CO2 = 45; // trees to absorb 1 ton CO₂/year
const LITERS_DIESEL_PER_KWH = 0.266;
const KM_PER_KG_CO2 = 6.1; // km an average car can drive per kg CO₂

export default function CarbonImpactPage() {
  const { data: analytics, isLoading: aLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
    staleTime: 30_000,
  });

  const { data: live, isLoading: lLoading } = useQuery({
    queryKey: ["liveEnergy"],
    queryFn: fetchLiveEnergy,
    staleTime: 10_000,
  });

  if (aLoading || lLoading || !analytics || !live) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  /* Calculate carbon metrics from generation data */
  const totalSolarGeneration = analytics.dailyGeneration.reduce((s, d) => s + d.generated, 0);
  const totalCO2Avoided = Math.round(totalSolarGeneration * CO2_PER_KWH); // kg
  const treesEquivalent = Math.round((totalCO2Avoided / 1000) * TREES_PER_TON_CO2);
  const dieselAvoided = Math.round(totalSolarGeneration * LITERS_DIESEL_PER_KWH);
  const carKmEquivalent = Math.round(totalCO2Avoided * KM_PER_KG_CO2);
  const todayCO2 = live.todaySummary.co2Avoided;
  const homesEquivalent = Math.round(totalSolarGeneration / 30 / 10); // avg 10kWh/day/home

  /* Carbon over time chart */
  const carbonTimeline = analytics.dailyGeneration.map((d) => ({
    date: d.date,
    "CO₂ Avoided (kg)": Math.round(d.generated * CO2_PER_KWH * 10) / 10,
    "Solar Generated (kWh)": d.generated,
  }));

  /* Impact donut */
  const impactBreakdown = [
    { name: "Electricity Offset", value: Math.round(totalCO2Avoided * 0.65) },
    { name: "Transport Equivalent", value: Math.round(totalCO2Avoided * 0.20) },
    { name: "Industrial Offset", value: Math.round(totalCO2Avoided * 0.15) },
  ];

  /* Monthly carbon */
  const monthlyCarbonChart = analytics.monthlyComparison.map((m) => ({
    month: m.month,
    "CO₂ Avoided (kg)": Math.round(m.thisYear * CO2_PER_KWH),
    "Last Year (kg)": Math.round(m.lastYear * CO2_PER_KWH),
  }));

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 p-6"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight"><TranslatedText text="Carbon Impact" /></h1>
          <p className="text-sm text-muted-foreground">
            <TranslatedText text="Environmental footprint tracking & sustainability metrics" />
          </p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" variant="outline">
          <Leaf className="mr-1 h-3 w-3" />
          <TranslatedText text="Net Positive" />
        </Badge>
      </div>

      {/* ── Hero KPI Row ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: "CO₂ Avoided (30d)", value: `${(totalCO2Avoided / 1000).toFixed(1)} tons`, icon: Wind, color: "emerald" },
          { label: "Today's CO₂ Saved", value: `${todayCO2} kg`, icon: Leaf, color: "green" },
          { label: "Trees Equivalent", value: `${treesEquivalent} trees`, icon: TreePine, color: "emerald" },
          { label: "Diesel Avoided", value: `${dieselAvoided} L`, icon: Fuel, color: "amber" },
        ].map((item) => (
          <motion.div key={item.label} variants={fadeUp}>
            <Card className="border-border/40 bg-surface-2">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  item.color === "emerald" && "bg-emerald-500/10",
                  item.color === "green" && "bg-green-500/10",
                  item.color === "amber" && "bg-amber-500/10",
                )}>
                  <item.icon className={cn(
                    "h-5 w-5",
                    item.color === "emerald" && "text-emerald-400",
                    item.color === "green" && "text-green-400",
                    item.color === "amber" && "text-amber-400",
                  )} />
                </div>
                <div>
                  <p className="text-lg font-bold">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider"><TranslatedText text={item.label} /></p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Real-World Equivalents ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-border/40 bg-surface-2 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Globe2 className="h-4 w-4 text-emerald-400" />
              <TranslatedText text="Real-World Impact Equivalents" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Car, label: "Car Travel Offset", value: `${carKmEquivalent.toLocaleString()} km`, sub: "Petrol car equivalent" },
                { icon: Home, label: "Homes Powered", value: `${homesEquivalent} homes`, sub: "Avg daily consumption" },
                { icon: Lightbulb, label: "LED Bulb Hours", value: `${Math.round(totalSolarGeneration * 100).toLocaleString()}`, sub: "10W LED equivalent" },
                { icon: Droplets, label: "Water Saved", value: `${Math.round(totalSolarGeneration * 1.5).toLocaleString()} L`, sub: "vs thermal power" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center gap-2 p-3 rounded-lg bg-surface-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                    <item.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-lg font-bold">{item.value}</p>
                  <div>
                    <p className="text-[11px] font-medium text-foreground/80"><TranslatedText text={item.label} /></p>
                    <p className="text-[9px] text-muted-foreground"><TranslatedText text={item.sub} /></p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Carbon Timeline */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card className="border-border/40 bg-surface-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <TranslatedText text="Daily CO₂ Avoidance (30 Days)" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart
                className="h-56"
                data={carbonTimeline}
                index="date"
                categories={["CO₂ Avoided (kg)"]}
                colors={["emerald"]}
                valueFormatter={(v: number) => `${v} kg`}
                showLegend={false}
                showGridLines={false}
                showAnimation
                curveType="monotone"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Impact Breakdown Donut */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-border/40 bg-surface-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Factory className="h-4 w-4 text-emerald-400" />
                <TranslatedText text="Impact Breakdown" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <DonutChart
                className="h-44"
                data={impactBreakdown}
                index="name"
                category="value"
                colors={["emerald", "cyan", "amber"]}
                valueFormatter={(v: number) => `${v} kg`}
                showAnimation
              />
              <div className="mt-3 space-y-1 w-full">
                {impactBreakdown.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className={cn(
                        "h-2 w-2 rounded-full",
                        idx === 0 && "bg-emerald-400",
                        idx === 1 && "bg-cyan-400",
                        idx === 2 && "bg-amber-400",
                      )} />
                      <TranslatedText text={item.name} />
                    </span>
                    <span className="font-medium">{item.value} kg</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Monthly Carbon Comparison ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-border/40 bg-surface-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Flame className="h-4 w-4 text-emerald-400" />
              <TranslatedText text="Monthly Carbon Offset — YoY Comparison" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              className="h-56"
              data={monthlyCarbonChart}
              index="month"
              categories={["CO₂ Avoided (kg)", "Last Year (kg)"]}
              colors={["emerald", "zinc"]}
              valueFormatter={(v: number) => `${v} kg`}
              showLegend
              showGridLines={false}
              showAnimation
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
