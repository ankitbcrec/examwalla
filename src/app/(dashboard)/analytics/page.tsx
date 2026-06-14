"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Target, Clock, Award } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

const weeklyData = [
  { day: "Mon", score: 65, tests: 1 },
  { day: "Tue", score: 72, tests: 2 },
  { day: "Wed", score: 68, tests: 1 },
  { day: "Thu", score: 80, tests: 3 },
  { day: "Fri", score: 75, tests: 2 },
  { day: "Sat", score: 88, tests: 4 },
  { day: "Sun", score: 82, tests: 2 },
];

const monthlyData = [
  { month: "Jan", score: 60 }, { month: "Feb", score: 65 },
  { month: "Mar", score: 70 }, { month: "Apr", score: 68 },
  { month: "May", score: 75 }, { month: "Jun", score: 78 },
];

const topicData = [
  { topic: "Equity Research", correct: 85, wrong: 15 },
  { topic: "Risk Management", correct: 60, wrong: 40 },
  { topic: "Derivatives", correct: 55, wrong: 45 },
  { topic: "Regulations", correct: 90, wrong: 10 },
  { topic: "Financial Analysis", correct: 75, wrong: 25 },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Analytics</h1>
        <p className="text-muted-foreground text-sm">Track your performance trends over time</p>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "This Week", value: "15 tests", icon: BarChart3, color: "text-violet-500", bg: "bg-violet-100 dark:bg-violet-950/40" },
          { label: "Avg This Week", value: "75.7%", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-950/40" },
          { label: "Best Topic", value: "Regulations", icon: Award, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-950/40" },
          { label: "Study Hours", value: "12h 30m", icon: Clock, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950/40" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-5 rounded-2xl border-border/60">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-sm font-bold">Weekly Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.54 0.22 280)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.54 0.22 280)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)" }} />
                <Area type="monotone" dataKey="score" stroke="oklch(0.54 0.22 280)" fill="url(#scoreGrad)" strokeWidth={2.5} dot={{ r: 4, fill: "oklch(0.54 0.22 280)" }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60">
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-sm font-bold">Monthly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)" }} />
                <Line type="monotone" dataKey="score" stroke="oklch(0.60 0.20 240)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Topic breakdown */}
      <Card className="rounded-2xl border-border/60">
        <CardHeader className="pb-2 pt-5 px-6">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Topic-wise Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topicData.map((topic) => (
            <div key={topic.topic}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{topic.topic}</span>
                <span className={`text-sm font-bold ${topic.correct >= 75 ? "text-emerald-500" : topic.correct >= 60 ? "text-amber-500" : "text-red-500"}`}>
                  {topic.correct}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.correct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${topic.correct >= 75 ? "bg-emerald-500" : topic.correct >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
