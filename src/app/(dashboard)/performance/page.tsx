"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Medal, Target, Zap } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

const radarData = [
  { subject: "Accuracy", A: 82 },
  { subject: "Speed", A: 68 },
  { subject: "Consistency", A: 74 },
  { subject: "Endurance", A: 85 },
  { subject: "Recall", A: 71 },
  { subject: "Problem Solving", A: 79 },
];

const milestones = [
  { label: "First Test Completed", date: "Jun 1, 2025", done: true, emoji: "🎯" },
  { label: "10 Tests Milestone", date: "Jun 8, 2025", done: true, emoji: "🔟" },
  { label: "First 80%+ Score", date: "Jun 10, 2025", done: true, emoji: "🌟" },
  { label: "7-Day Streak", date: "Jun 14, 2025", done: true, emoji: "🔥" },
  { label: "25 Tests Milestone", date: "In progress", done: false, emoji: "🏆" },
  { label: "Reach 90% Accuracy", date: "Not yet", done: false, emoji: "🎖️" },
];

export default function PerformancePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Performance</h1>
        <p className="text-muted-foreground text-sm">Your skill profile and achievement milestones</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar chart */}
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Skill Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="oklch(0.54 0.22 280)" fill="oklch(0.54 0.22 280)" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)" }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Medal className="w-4 h-4 text-primary" />
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {milestones.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${m.done ? "bg-muted/40" : "opacity-50"}`}
              >
                <span className="text-xl">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.date}</p>
                </div>
                {m.done && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Improvement tips */}
      <Card className="rounded-2xl border-border/60">
        <CardHeader className="pb-2 pt-5 px-6">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            AI Improvement Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { area: "Speed", current: "68%", goal: "80%", tip: "Practice under 45-second time boxes per question", color: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20" },
              { area: "Recall", current: "71%", goal: "85%", tip: "Use active recall — close notes and write what you remember", color: "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/20" },
              { area: "Consistency", current: "74%", goal: "88%", tip: "Attempt at least 1 test daily to build consistent performance", color: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20" },
            ].map((tip) => (
              <div key={tip.area} className={`rounded-2xl border p-4 ${tip.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-foreground">{tip.area}</span>
                  <span className="text-xs text-muted-foreground">{tip.current} → {tip.goal}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
