/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — 48-Hour Solar Forecast Page
 * ─────────────────────────────────────────────────────────
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, pageTransition } from "@/lib/motion";
import { fetchAIAdvisor } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, BarChart } from "@tremor/react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Thermometer,
  Eye,
  TrendingUp,
  Sparkles,
  Calendar,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TranslatedText } from "@/components/ui/translated-text";


/* ── Weather icon mapping ── */
const weatherIcons: Record<string, React.ReactNode> = {
  sunny: <Sun className="h-4 w-4 text-yellow-400" />,
  "partly-cloudy": <CloudSun className="h-4 w-4 text-orange-300" />,
  cloudy: <Cloud className="h-4 w-4 text-gray-400" />,
  rainy: <CloudRain className="h-4 w-4 text-blue-400" />,
};

const weatherLabels: Record<string, string> = {
  sunny: "Sunny",
  "partly-cloudy": "Partly Cloudy",
  cloudy: "Cloudy",
  rainy: "Rainy",
};

export default function SolarForecastPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["aiAdvisor"],
    queryFn: fetchAIAdvisor,
    staleTime: 30_000,
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const forecast = data.forecast;

  /* Split into today & tomorrow */
  const uniqueDates = Array.from(new Set(forecast.map((f) => f.date)));
  const todayData = forecast.filter((f) => f.date === uniqueDates[0]);
  const tomorrowData = forecast.filter((f) => f.date === uniqueDates[1]);

  /* Chart data */
  const predictionChart = forecast
    .filter((f) => f.predicted > 0)
    .map((f) => ({
      hour: `${f.date.slice(5)} ${String(f.hour).padStart(2, "0")}:00`,
      "Predicted kW": f.predicted,
      "Irradiance (W/m²)": f.irradiance / 100, // scale for shared axis
    }));

  const confidenceChart = forecast
    .filter((f) => f.predicted > 0)
    .map((f) => ({
      hour: `${String(f.hour).padStart(2, "0")}:00`,
      Confidence: Math.round(f.confidence * 100),
    }));

  /* Peak values */
  const peakPower = Math.max(...forecast.map((f) => f.predicted));
  const avgConfidence = Math.round(
    (forecast.filter((f) => f.predicted > 0).reduce((s, f) => s + f.confidence, 0) /
      forecast.filter((f) => f.predicted > 0).length) * 100
  );
  const totalPredicted = Math.round(forecast.reduce((s, f) => s + f.predicted, 0) * 10) / 10;

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
          <h1 className="text-2xl font-bold tracking-tight"><TranslatedText text="Solar Forecast" /></h1>
          <p className="text-sm text-muted-foreground">
            <TranslatedText text="48-hour AI prediction with weather-correlated irradiance modeling" />
          </p>
        </div>
        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20" variant="outline">
          <Sparkles className="mr-1 h-3 w-3" />
          <TranslatedText text="ML Prediction" />
        </Badge>
      </div>

      {/* ── Summary KPIs ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: "Peak Predicted", value: `${peakPower.toFixed(1)} kW`, icon: TrendingUp, color: "text-yellow-400 bg-yellow-500/10" },
          { label: "Total 48hr Yield", value: `${totalPredicted} kWh`, icon: Sun, color: "text-emerald-400 bg-emerald-500/10" },
          { label: "Avg Confidence", value: `${avgConfidence}%`, icon: Eye, color: "text-purple-400 bg-purple-500/10" },
          { label: "Forecast Range", value: "48 hours", icon: Calendar, color: "text-blue-400 bg-blue-500/10" },
        ].map((item) => (
          <motion.div key={item.label} variants={fadeUp}>
            <Card className="border-border/40 bg-surface-2">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", item.color.split(" ")[1])}>
                  <item.icon className={cn("h-5 w-5", item.color.split(" ")[0])} />
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

      {/* ── 48hr Prediction Chart ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-border/40 bg-surface-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <TranslatedText text="48-Hour Solar Generation Forecast" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              className="h-64"
              data={predictionChart}
              index="hour"
              categories={["Predicted kW"]}
              colors={["amber"]}
              valueFormatter={(v: number) => `${v.toFixed(1)} kW`}
              showLegend
              showGridLines={false}
              showAnimation
              curveType="monotone"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Hourly Detail (Today & Tomorrow) ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[
          { label: "Today", data: todayData, date: uniqueDates[0] },
          { label: "Tomorrow", data: tomorrowData, date: uniqueDates[1] },
        ].map((day) => (
          <motion.div key={day.label} variants={fadeUp} initial="hidden" animate="visible">
            <Card className="border-border/40 bg-surface-2">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Calendar className="h-4 w-4 text-yellow-400" />
                  <TranslatedText text={day.label} /> — {day.date}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto pr-1">
                  {day.data
                    .filter((f) => f.hour >= 6 && f.hour <= 18)
                    .map((f, idx) => (
                      <motion.div
                        key={`${f.date}-${f.hour}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="flex items-center gap-3 rounded-md bg-surface-3 px-3 py-2"
                      >
                        <span className="w-12 text-xs font-mono text-muted-foreground">
                          {String(f.hour).padStart(2, "0")}:00
                        </span>
                        <span className="w-6">{weatherIcons[f.weather]}</span>
                        <span className="text-[10px] w-20 text-muted-foreground">
                          <TranslatedText text={weatherLabels[f.weather]} />
                        </span>
                        <div className="flex-1">
                          <div className="h-1.5 rounded-full bg-surface-4 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-yellow-500 transition-all duration-300"
                              style={{ width: `${(f.predicted / peakPower) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="w-16 text-right text-xs font-bold">
                          {f.predicted.toFixed(1)} kW
                        </span>
                        <span className="w-14 text-right text-[10px] text-muted-foreground">
                          {f.irradiance} W/m²
                        </span>
                        <div className="flex items-center gap-1 w-10">
                          <Thermometer className="h-3 w-3 text-orange-400" />
                          <span className="text-[10px]">{f.temperature}°</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] px-1 py-0",
                            f.confidence >= 0.9
                              ? "text-emerald-400 border-emerald-500/20"
                              : f.confidence >= 0.8
                              ? "text-yellow-400 border-yellow-500/20"
                              : "text-orange-400 border-orange-500/20"
                          )}
                        >
                          {Math.round(f.confidence * 100)}%
                        </Badge>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Confidence Chart ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Card className="border-border/40 bg-surface-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Gauge className="h-4 w-4 text-purple-400" />
              <TranslatedText text="Prediction Confidence by Hour" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              className="h-40"
              data={confidenceChart}
              index="hour"
              categories={["Confidence"]}
              colors={["violet"]}
              valueFormatter={(v: number) => `${v}%`}
              showLegend={false}
              showGridLines={false}
              showAnimation
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
