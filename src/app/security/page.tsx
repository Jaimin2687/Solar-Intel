/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — DISCOM / Grid Intelligence Page
 * ─────────────────────────────────────────────────────────
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, pageTransition } from "@/lib/motion";
import { fetchGridData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, BarChart } from "@tremor/react";
import {
  Network,
  CheckCircle2,
  Zap,
  Activity,
  AlertTriangle,
  Radio,
  ArrowUpRight,
  Clock,
  IndianRupee,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TranslatedText } from "@/components/ui/translated-text";

/* ── severity styles ── */
const severityColors: Record<string, string> = {
  critical: "text-red-400 bg-red-500/10 border-red-500/20",
  warning: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  info: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

const eventTypeIcons: Record<string, React.ReactNode> = {
  outage: <Zap className="h-4 w-4" />,
  "voltage-sag": <Activity className="h-4 w-4" />,
  "frequency-deviation": <Radio className="h-4 w-4" />,
  "sync-loss": <AlertTriangle className="h-4 w-4" />,
  "export-limit": <Gauge className="h-4 w-4" />,
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export default function DISCOMGridPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["gridData"],
    queryFn: fetchGridData,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  if (isLoading || !data) {
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

  /* chart data for net metering */
  const netMeteringChart = data.monthlyNetMetering.map((m) => ({
    month: m.month,
    Imported: m.imported,
    Exported: m.exported,
  }));

  const earningsChart = data.monthlyNetMetering.map((m) => ({
    month: m.month,
    "Net Earnings (₹)": m.netAmount,
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
          <h1 className="text-2xl font-bold tracking-tight"><TranslatedText text="DISCOM / Grid" /></h1>
          <p className="text-sm text-muted-foreground">
            <TranslatedText text="Net metering, grid synchronization & DISCOM interface" />
          </p>
        </div>
        <Badge
          className={cn(
            "text-xs font-medium",
            data.netMeteringStatus === "approved"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          )}
          variant="outline"
        >
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Net Metering <TranslatedText text={data.netMeteringStatus} />
        </Badge>
      </div>

      {/* ── Connection Info Cards ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: "DISCOM", value: data.discomName, icon: Network, sub: `Account: ${data.accountId}` },
          { label: "Feed-in Tariff", value: `₹${data.feedInTariff.toFixed(2)}/kWh`, icon: IndianRupee, sub: `Valid until ${data.contractValid}` },
          { label: "Export Earnings", value: `₹${(data.exportEarnings * 1000).toLocaleString()}`, icon: ArrowUpRight, sub: "Total lifetime earnings" },
          { label: "Meter ID", value: data.meterId, icon: Gauge, sub: "Smart bi-directional meter" },
        ].map((item) => (
          <motion.div key={item.label} variants={fadeUp}>
            <Card className="border-border/40 bg-surface-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <item.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      <TranslatedText text={item.label} />
                    </p>
                    <p className="text-base font-bold tracking-tight truncate">{item.value}</p>
                    <p className="text-[11px] text-muted-foreground"><TranslatedText text={item.sub} /></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Grid Sync Quality Gauges ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-border/40 bg-surface-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <TranslatedText text="Grid Synchronization Quality" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { label: "Sync Quality", value: data.syncQuality, color: "emerald" },
                { label: "Voltage Stability", value: data.voltageStability, color: "blue" },
                { label: "Frequency Stability", value: data.frequencyStability, color: "purple" },
              ].map((gauge) => (
                <div key={gauge.label} className="flex flex-col items-center gap-3">
                  {/* Circular gauge */}
                  <div className="relative h-28 w-28">
                    <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(240 4% 14%)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42"
                        fill="none"
                        stroke={gauge.color === "emerald" ? "#34d399" : gauge.color === "blue" ? "#60a5fa" : "#a78bfa"}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${gauge.value * 2.64} ${264 - gauge.value * 2.64}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold">{gauge.value}%</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    <TranslatedText text={gauge.label} />
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Net Metering Import/Export */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-border/40 bg-surface-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                <TranslatedText text="Monthly Import vs Export (kWh)" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                className="h-56"
                data={netMeteringChart}
                index="month"
                categories={["Imported", "Exported"]}
                colors={["rose", "emerald"]}
                valueFormatter={(v: number) => `${v} kWh`}
                showLegend
                showGridLines={false}
                showAnimation
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Earnings Chart */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Card className="border-border/40 bg-surface-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <IndianRupee className="h-4 w-4 text-emerald-400" />
                <TranslatedText text="Net Metering Earnings" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart
                className="h-56"
                data={earningsChart}
                index="month"
                categories={["Net Earnings (₹)"]}
                colors={["emerald"]}
                valueFormatter={(v: number) => `₹${v}`}
                showLegend={false}
                showGridLines={false}
                showAnimation
                curveType="monotone"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Grid Events Timeline ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-border/40 bg-surface-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <TranslatedText text="Recent Grid Events" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.gridEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3",
                    severityColors[event.severity]
                  )}
                >
                  <div className="mt-0.5">{eventTypeIcons[event.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        <TranslatedText text={event.type.replace(/-/g, " ")} />
                      </span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        <TranslatedText text={event.severity} />
                      </Badge>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      <TranslatedText text={event.description} />
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                      <span><TranslatedText text="Duration" />: {formatDuration(event.duration)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
