/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Anomaly Detection Page
 * ─────────────────────────────────────────────────────────
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, pageTransition } from "@/lib/motion";
import { fetchAIAdvisor } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Activity,
  Thermometer,
  Zap,
  Radio,
  Filter,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { AnomalySeverity } from "@/types";
import { TranslatedText } from "@/components/ui/translated-text";

const severityConfig: Record<
  AnomalySeverity,
  { color: string; icon: React.ReactNode; bg: string }
> = {
  critical: {
    color: "text-red-400",
    icon: <ShieldAlert className="h-4 w-4 text-red-400" />,
    bg: "bg-red-500/10 border-red-500/20",
  },
  warning: {
    color: "text-yellow-400",
    icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  info: {
    color: "text-blue-400",
    icon: <Activity className="h-4 w-4 text-blue-400" />,
    bg: "bg-blue-500/10 border-blue-500/20",
  },
};

const parameterIcons: Record<string, React.ReactNode> = {
  "Junction Temperature": <Thermometer className="h-4 w-4" />,
  "THD (Current)": <Radio className="h-4 w-4" />,
  "MPPT Efficiency": <Zap className="h-4 w-4" />,
  "String Voltage Mismatch": <BarChart3 className="h-4 w-4" />,
  "Efficiency Dip": <TrendingDown className="h-4 w-4" />,
  "Fan Speed Increase": <Activity className="h-4 w-4" />,
};

export default function AnomalyDetectPage() {
  const [filter, setFilter] = useState<"all" | AnomalySeverity>("all");
  const [showResolved, setShowResolved] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ["aiAdvisor"],
    queryFn: fetchAIAdvisor,
    staleTime: 30_000,
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const anomalies = data.anomalies
    .filter((a) => filter === "all" || a.severity === filter)
    .filter((a) => showResolved || !a.isResolved);

  const totalCritical = data.anomalies.filter((a) => a.severity === "critical" && !a.isResolved).length;
  const totalWarning = data.anomalies.filter((a) => a.severity === "warning" && !a.isResolved).length;
  const totalResolved = data.anomalies.filter((a) => a.isResolved).length;

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
          <h1 className="text-2xl font-bold tracking-tight"><TranslatedText text="Anomaly Detection" /></h1>
          <p className="text-sm text-muted-foreground">
            <TranslatedText text="Real-time parameter deviation monitoring & smart alerts" />
          </p>
        </div>
        <Badge className="bg-red-500/10 text-red-400 border-red-500/20" variant="outline">
          <ShieldAlert className="mr-1 h-3 w-3" />
          {totalCritical + totalWarning} <TranslatedText text="Active Anomalies" />
        </Badge>
      </div>

      {/* ── Summary Cards ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {[
          { label: "Critical",  count: totalCritical, icon: ShieldAlert,   color: "red",     description: "Requires immediate action" },
          { label: "Warning",   count: totalWarning,  icon: AlertTriangle, color: "yellow",  description: "Trending toward threshold"  },
          { label: "Resolved",  count: totalResolved, icon: CheckCircle2,  color: "emerald", description: "Successfully mitigated"     },
        ].map((item) => (
          <motion.div key={item.label} variants={fadeUp}>
            <Card className="border-border/40 bg-surface-2">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    item.color === "red" && "bg-red-500/10",
                    item.color === "yellow" && "bg-yellow-500/10",
                    item.color === "emerald" && "bg-emerald-500/10"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-6 w-6",
                      item.color === "red" && "text-red-400",
                      item.color === "yellow" && "text-yellow-400",
                      item.color === "emerald" && "text-emerald-400"
                    )}
                  />
                </div>
                <div>
                  <p className="text-3xl font-bold">{item.count}</p>
                  <p className="text-xs text-muted-foreground"><TranslatedText text={item.description} /></p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </div>
        {(["all", "critical", "warning", "info"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors border",
              filter === f
                ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                : "bg-surface-2 text-muted-foreground border-border/40 hover:bg-surface-3"
            )}
          >
            {f === "all" ? <TranslatedText text="All" /> : <TranslatedText text={f.charAt(0).toUpperCase() + f.slice(1)} />}
          </button>
        ))}
        <button
          onClick={() => setShowResolved(!showResolved)}
          title={showResolved ? "Showing Resolved" : "Hiding Resolved"}
          className={cn(
            "ml-auto rounded-md px-3 py-1.5 text-xs font-medium transition-colors border",
            showResolved
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-surface-2 text-muted-foreground border-border/40"
          )}
        >
          <TranslatedText text={showResolved ? "Showing Resolved" : "Hiding Resolved"} />
        </button>
      </div>

      {/* ── Anomaly Cards ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {anomalies.map((anomaly) => {
          const config = severityConfig[anomaly.severity];
          const deviation = ((anomaly.actualValue - anomaly.expectedValue) / anomaly.expectedValue * 100);
          const isOver = anomaly.actualValue > anomaly.expectedValue;

          return (
            <motion.div key={anomaly.id} variants={fadeUp}>
              <Card className={cn("border-border/40 bg-surface-2", anomaly.isResolved && "opacity-60")}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border", config.bg)}>
                      {parameterIcons[anomaly.parameter] || config.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold"><TranslatedText text={anomaly.parameter} /></span>
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", config.bg, config.color)}>
                          <TranslatedText text={anomaly.severity} />
                        </Badge>
                        {anomaly.isResolved && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            <CheckCircle2 className="mr-0.5 h-2.5 w-2.5" /> <TranslatedText text="Resolved" />
                          </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {anomaly.inverterName}
                        </span>
                      </div>

                      <p className="text-xs text-foreground/80 leading-relaxed mb-3">
                        <TranslatedText text={anomaly.description} />
                      </p>

                      {/* Deviation Bar */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                            <span><TranslatedText text="Expected" />: {anomaly.expectedValue}{anomaly.unit}</span>
                            <span><TranslatedText text="Actual" />: {anomaly.actualValue}{anomaly.unit}</span>
                          </div>
                          <div className="h-2 rounded-full bg-surface-4 overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                anomaly.severity === "critical" ? "bg-red-500" :
                                anomaly.severity === "warning" ? "bg-yellow-500" : "bg-blue-500"
                              )}
                              style={{ width: `${Math.min(Math.abs(deviation), 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className={cn("flex items-center gap-1 text-xs font-bold", config.color)}>
                          {isOver ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {deviation > 0 ? "+" : ""}{deviation.toFixed(1)}%
                        </div>
                      </div>

                      <p className="mt-2 text-[10px] text-muted-foreground">
                        {new Date(anomaly.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {anomalies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 mb-3 text-emerald-500/50" />
            <p className="text-sm font-medium"><TranslatedText text="No anomalies match your filter" /></p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
