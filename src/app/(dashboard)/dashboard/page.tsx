"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeroCard from "@/components/dashboard/HeroCard";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentTests from "@/components/dashboard/RecentTests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight, Flame, Zap, BookOpen } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { DashboardStats, RecentTest } from "@/types";

const quickExams = [
  { name: "NISM Series XV", tag: "Finance", emoji: "📈", id: "nism-xv" },
  { name: "AWS Solutions Architect", tag: "Cloud", emoji: "☁️", id: "aws-saa" },
  { name: "Python Certification", tag: "Tech", emoji: "🐍", id: "python-cert" },
  { name: "SSC CGL", tag: "Govt", emoji: "🏛️", id: "ssc-cgl" },
];

const upcomingGoals = [
  { label: "Complete 30 tests", target: 30, color: "bg-violet-500" },
  { label: "Reach 85% avg score", target: 85, color: "bg-blue-500" },
  { label: "Study 50 hours", target: 50, color: "bg-emerald-500" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTests, setLoadingTests] = useState(true);

  useEffect(() => {
    // Get user display name
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserName(
          user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Student"
        );
      }
    });

    // Fetch real stats from API
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .finally(() => setLoadingStats(false));

    // Fetch recent test attempts from API
    fetch("/api/results")
      .then((r) => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          setRecentTests(
            data.map((a) => ({
              id: a.id,
              exam_name: a.exam_name,
              score: a.score,
              total_marks: a.total_marks,
              accuracy: a.accuracy,
              time_taken_seconds: a.time_taken_seconds,
              status: a.status,
              submitted_at: a.created_at,
            }))
          );
        }
      })
      .finally(() => setLoadingTests(false));
  }, []);

  // Derive goal progress from real stats
  const goalValues = [
    stats?.tests_attempted ?? 0,
    stats?.average_score ?? 0,
    Math.round((stats?.total_study_time_minutes ?? 0) / 60),
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <HeroCard userName={userName} />
      <StatsCards stats={stats ?? undefined} loading={loadingStats} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTests tests={recentTests} loading={loadingTests} />
        </div>

        <div className="space-y-5">
          {/* Streak card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-2xl border-border/60 overflow-hidden">
              <div
                className="h-2"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.54 0.22 280), oklch(0.60 0.20 240))",
                }}
              />
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Keep Practicing 🔥</p>
                    <p className="text-xs text-muted-foreground">
                      {stats?.tests_attempted ?? 0} tests completed
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
                          i < Math.min(stats?.tests_attempted ?? 0, 7)
                            ? "gradient-primary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i < Math.min(stats?.tests_attempted ?? 0, 7) ? "✓" : "·"}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="rounded-2xl border-border/60">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  My Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-4">
                {upcomingGoals.map((goal, i) => {
                  const current = goalValues[i];
                  const pct = Math.min(
                    100,
                    Math.round((current / goal.target) * 100)
                  );
                  return (
                    <div key={goal.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-foreground">
                          {goal.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {current}/{goal.target}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${goal.color}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="rounded-2xl border-border/60">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Quick Start
                  </CardTitle>
                  <Link href="/tests">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-primary rounded-lg gap-1">
                      All <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-2">
                {quickExams.map((exam) => (
                  <Link key={exam.id} href={`/exam/${exam.id}`}>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors cursor-pointer group">
                      <span className="text-lg">{exam.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {exam.name}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {exam.tag}
                      </Badge>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* AI Study Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="rounded-2xl border-primary/20 bg-primary/5 dark:bg-primary/10">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">AI Study Tip of the Day</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Spaced repetition is 90% more effective than massed practice. Review your
                weak topics every 3 days for best retention.
              </p>
            </div>
            <Link href="/study-material">
              <Button size="sm" className="rounded-xl shrink-0 gradient-primary text-white border-0">
                Study Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
