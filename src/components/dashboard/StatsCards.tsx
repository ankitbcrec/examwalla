"use client";

import { motion } from "framer-motion";
import { FileText, TrendingUp, Trophy, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats?: DashboardStats;
  loading?: boolean;
}

const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

const statItems = (stats?: DashboardStats) => [
  {
    label: "Tests Attempted",
    value: stats?.tests_attempted?.toString() ?? "0",
    icon: FileText,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    trend: "+3 this week",
    trendUp: true,
  },
  {
    label: "Average Score",
    value: stats ? `${stats.average_score}%` : "–",
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    trend: "+5% from last month",
    trendUp: true,
  },
  {
    label: "Best Score",
    value: stats ? `${stats.best_score}%` : "–",
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    trend: "Personal best!",
    trendUp: true,
  },
  {
    label: "Total Study Time",
    value: stats ? formatTime(stats.total_study_time_minutes) : "0m",
    icon: Clock,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    trend: "2h 30m today",
    trendUp: true,
  },
];

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  const items = statItems(stats);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
        >
          <Card className="p-5 rounded-2xl border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300 group">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-muted" />
                <div className="h-7 w-16 rounded-lg bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
              </div>
            ) : (
              <>
                <div
                  className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>

                <div className="text-2xl font-bold text-foreground mb-1">{item.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
                <div className="mt-2 text-xs text-emerald-500 font-medium">{item.trend}</div>
              </>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
