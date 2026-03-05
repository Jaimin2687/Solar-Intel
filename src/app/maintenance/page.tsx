/**
 * ─────────────────────────────────────────────────────────
 * Solar Intel — Maintenance Schedule Page
 * ─────────────────────────────────────────────────────────
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, pageTransition } from "@/lib/motion";
import { fetchAIAdvisor } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wrench,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2,
  RotateCw,
  Timer,
  Clipboard,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TranslatedText } from "@/components/ui/translated-text";
import type { MaintenanceStatus, RiskLevel } from "@/types";

/* ── Status config ── */
const statusConfig: Record<MaintenanceStatus, { color: string; icon: React.ReactNode; label: string }> = {
  scheduled: {
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    icon: <Calendar className="h-3.5 w-3.5" />,
    label: "Scheduled",
  },
  "in-progress": {
    color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    icon: <RotateCw className="h-3.5 w-3.5 animate-spin" />,
    label: "In Progress",
  },
  completed: {
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    label: "Completed",
  },
  overdue: {
    color: "text-red-400 bg-red-500/10 border-red-500/20",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    label: "Overdue",
  },
};

const priorityConfig: Record<RiskLevel, { color: string; label: string }> = {
  critical: { color: "text-red-400 bg-red-500/10 border-red-500/20", label: "Critical" },
  high: { color: "text-orange-400 bg-orange-500/10 border-orange-500/20", label: "High" },
  medium: { color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", label: "Medium" },
  low: { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", label: "Low" },
};

export default function MaintenancePage() {
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

  const schedule = data.maintenanceSchedule;
  const scheduled = schedule.filter((m) => m.status === "scheduled").length;
  const inProgress = schedule.filter((m) => m.status === "in-progress").length;
  const completed = schedule.filter((m) => m.status === "completed").length;

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
          <h1 className="text-2xl font-bold tracking-tight"><TranslatedText text="Maintenance" /></h1>
          <p className="text-sm text-muted-foreground">
            <TranslatedText text="AI-prioritized maintenance schedule & task management" />
          </p>
        </div>
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20" variant="outline">
          <Clipboard className="mr-1 h-3 w-3" />
          {schedule.length} <TranslatedText text="Tasks" />
        </Badge>
      </div>

      {/* ── Summary ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {[
          { label: "Scheduled", count: scheduled, icon: Calendar, color: "blue" },
          { label: "In Progress", count: inProgress, icon: RotateCw, color: "yellow" },
          { label: "Completed", count: completed, icon: CheckCircle2, color: "emerald" },
        ].map((item) => (
          <motion.div key={item.label} variants={fadeUp}>
            <Card className="border-border/40 bg-surface-2">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  item.color === "blue" && "bg-blue-500/10",
                  item.color === "yellow" && "bg-yellow-500/10",
                  item.color === "emerald" && "bg-emerald-500/10",
                )}>
                  <item.icon className={cn(
                    "h-6 w-6",
                    item.color === "blue" && "text-blue-400",
                    item.color === "yellow" && "text-yellow-400",
                    item.color === "emerald" && "text-emerald-400",
                  )} />
                </div>
                <div>
                  <p className="text-3xl font-bold">{item.count}</p>
                  <p className="text-xs text-muted-foreground"><TranslatedText text={item.label} /></p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Task Cards ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {schedule.map((task) => {
          const status = statusConfig[task.status];
          const priority = priorityConfig[task.priority];

          return (
            <motion.div key={task.id} variants={fadeUp}>
              <Card className={cn(
                "border-border/40 bg-surface-2 transition-all hover:bg-surface-3",
                task.status === "completed" && "opacity-60",
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div className={cn(
                      "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                      status.color,
                    )}>
                      <Wrench className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-sm font-semibold"><TranslatedText text={task.task} /></span>
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", status.color)}>
                          {status.icon}
                          <span className="ml-1"><TranslatedText text={status.label} /></span>
                        </Badge>
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", priority.color)}>
                          <TranslatedText text={priority.label} /> <TranslatedText text="Priority" />
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3">
                        {task.inverterName} ({task.inverterId})
                      </p>

                      {/* Details row */}
                      <div className="flex items-center gap-4 flex-wrap text-[11px] text-foreground/70">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-blue-400" />
                          {task.scheduledDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Timer className="h-3 w-3 text-purple-400" />
                          {task.estimatedDuration}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3 text-emerald-400" />
                          {task.assignedTo}
                        </span>
                      </div>

                      {/* Notes */}
                      {task.notes && (
                        <div className="mt-3 flex items-start gap-2 rounded-md bg-surface-3 p-2.5">
                          <MessageSquare className="h-3 w-3 mt-0.5 shrink-0 text-muted-foreground" />
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            <TranslatedText text={task.notes} />
                          </p>
                        </div>
                      )}
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground mt-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
