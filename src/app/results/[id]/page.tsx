"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Download,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  XCircle,
  MinusCircle,
  Share2,
  Medal,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ResultData {
  exam_id: string;
  score: number;
  total_marks: number;
  correct: number;
  wrong: number;
  skipped: number;
  time_taken: number;
  accuracy: number;
  percentile: number;
}

const sectionData = [
  { section: "Section A", correct: 7, wrong: 2, skipped: 1, total: 10 },
  { section: "Section B", correct: 6, wrong: 3, skipped: 1, total: 10 },
  { section: "Section C", correct: 8, wrong: 1, skipped: 1, total: 10 },
];

const timeData = [
  { name: "0-30s", questions: 8 },
  { name: "30-60s", questions: 12 },
  { name: "1-2m", questions: 7 },
  { name: ">2m", questions: 3 },
];

const COLORS = {
  correct: "#10b981",
  wrong: "#ef4444",
  skipped: "#94a3b8",
};

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  return `${m}m ${sec}s`;
}

function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/40" />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-3xl font-black"
          style={{ color }}
        >
          {pct}%
        </motion.span>
        <span className="text-xs text-muted-foreground font-medium">Score</span>
      </div>
    </div>
  );
}

const aiInsightTemplates = [
  `Great effort on completing the exam! You demonstrated solid knowledge across multiple sections.

**Your Strengths:**
• Section C showed excellent performance — you got 8/10 correct, showing mastery of advanced concepts
• Your time management was efficient; most questions answered within 60 seconds
• Low skipped count shows confidence and preparation

**Areas to Improve:**
• Section B needs attention — focus on reviewing the concepts where you went wrong
• Review your wrong answers carefully; pattern-based mistakes can be quickly corrected
• Practice negative marking strategy: skip when less than 50% confident

**Actionable Study Tips:**
• Spend 30 minutes daily reviewing Section B topics
• Attempt 2-3 full mock tests per week to build exam stamina
• Use flashcards for topics where you consistently make mistakes

You're on the right track! With focused revision on weak areas, you can significantly boost your score in the next attempt. Keep going! 🎯`,
];

export default function ResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(true);
  const [tab, setTab] = useState("overview");
  const counterRef = useRef(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("last_result");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      // Demo fallback
      setResult({
        exam_id: params.id,
        score: 21,
        total_marks: 30,
        correct: 21,
        wrong: 6,
        skipped: 3,
        time_taken: 3720,
        accuracy: 78,
        percentile: 72,
      });
    }

    // Simulate AI loading
    const timer = setTimeout(() => {
      setAiInsight(aiInsightTemplates[0]);
      setLoadingInsight(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [params.id]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const pct = Math.round((result.score / result.total_marks) * 100);
  const passed = pct >= 60;
  const pieData = [
    { name: "Correct", value: result.correct, color: COLORS.correct },
    { name: "Wrong", value: result.wrong, color: COLORS.wrong },
    { name: "Skipped", value: result.skipped, color: COLORS.skipped },
  ];

  const sectionChartData = sectionData.map((s) => ({
    ...s,
    score: Math.round((s.correct / s.total) * 100),
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border/60 px-4 md:px-8 h-14 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm hidden sm:block">ExamWalla</span>
        </div>
        <Separator orientation="vertical" className="h-5" />
        <span className="text-sm font-semibold text-muted-foreground">Exam Results</span>

        <div className="flex-1" />

        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="rounded-xl gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
        </Link>

        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-2 text-sm border-border/60"
        >
          <Download className="w-4 h-4" />
          Report
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl gap-2 text-sm text-primary"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        {/* Hero Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: passed
              ? "linear-gradient(135deg, oklch(0.35 0.14 160) 0%, oklch(0.45 0.18 180) 100%)"
              : "linear-gradient(135deg, oklch(0.35 0.18 25) 0%, oklch(0.42 0.20 15) 100%)",
          }}
        >
          {/* BG pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 50% 80%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />

          <div className="relative p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Score ring */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="relative">
                  <ScoreRing score={result.score} total={result.total_marks} />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className={cn(
                    "px-5 py-2 rounded-2xl font-bold text-sm",
                    passed ? "bg-emerald-400/20 text-white border border-emerald-300/30" : "bg-red-400/20 text-white border border-red-300/30"
                  )}
                >
                  {passed ? "✅ PASSED" : "❌ NEEDS IMPROVEMENT"}
                </motion.div>
              </div>

              {/* Stats */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                {[
                  { label: "Score", value: `${result.score}/${result.total_marks}`, icon: Trophy },
                  { label: "Accuracy", value: `${result.accuracy}%`, icon: Target },
                  { label: "Percentile", value: `${result.percentile}th`, icon: Medal },
                  { label: "Time Taken", value: formatTime(result.time_taken), icon: Clock },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15"
                  >
                    <stat.icon className="w-5 h-5 text-white/70 mb-2" />
                    <div className="text-2xl font-black">{stat.value}</div>
                    <div className="text-xs text-white/60 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Answer summary row */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              {[
                { label: "Correct", value: result.correct, icon: CheckCircle, color: "text-emerald-300" },
                { label: "Wrong", value: result.wrong, icon: XCircle, color: "text-red-300" },
                { label: "Skipped", value: result.skipped, icon: MinusCircle, color: "text-white/50" },
              ].map((stat) => (
                <div key={stat.label} className={`flex items-center gap-2 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{stat.value} {stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="rounded-2xl p-1 h-auto bg-muted/60">
            <TabsTrigger value="overview" className="rounded-xl px-5 py-2 text-sm font-semibold data-[state=active]:shadow-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="sections" className="rounded-xl px-5 py-2 text-sm font-semibold data-[state=active]:shadow-sm">
              Section Analysis
            </TabsTrigger>
            <TabsTrigger value="time" className="rounded-xl px-5 py-2 text-sm font-semibold data-[state=active]:shadow-sm">
              Time Analysis
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Answer Distribution Pie */}
              <Card className="rounded-2xl border-border/60">
                <CardHeader className="pb-2 pt-5 px-6">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Answer Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance vs average */}
              <Card className="rounded-2xl border-border/60">
                <CardHeader className="pb-2 pt-5 px-6">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Performance vs Average
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={90}
                      data={[
                        { name: "Your Score", value: pct, fill: "oklch(0.54 0.22 280)" },
                        { name: "Class Avg", value: 65, fill: "oklch(0.60 0.20 240)" },
                        { name: "Topper", value: 94, fill: "oklch(0.72 0.18 150)" },
                      ]}
                    >
                      <RadialBar dataKey="value" label={{ position: "insideStart", fill: "#fff", fontSize: 10 }} />
                      <Legend />
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Section Analysis Tab */}
          <TabsContent value="sections" className="mt-6">
            <Card className="rounded-2xl border-border/60">
              <CardHeader className="pb-2 pt-5 px-6">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Section-wise Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={sectionChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="section" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 10]} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)" }}
                    />
                    <Legend />
                    <Bar dataKey="correct" name="Correct" fill={COLORS.correct} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="wrong" name="Wrong" fill={COLORS.wrong} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="skipped" name="Skipped" fill={COLORS.skipped} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                {/* Section table */}
                <div className="rounded-2xl border border-border/60 overflow-hidden">
                  <div className="grid grid-cols-6 gap-2 bg-muted/50 px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    <span className="col-span-2">Section</span>
                    <span className="text-center">Score</span>
                    <span className="text-center text-emerald-500">✓</span>
                    <span className="text-center text-red-500">✗</span>
                    <span className="text-center text-muted-foreground">–</span>
                  </div>
                  {sectionData.map((s) => {
                    const pctS = Math.round((s.correct / s.total) * 100);
                    return (
                      <div key={s.section} className="grid grid-cols-6 gap-2 items-center px-4 py-3 border-t border-border/40 hover:bg-accent/30 transition-colors">
                        <span className="col-span-2 text-sm font-semibold">{s.section}</span>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`text-sm font-bold ${pctS >= 70 ? "text-emerald-500" : pctS >= 50 ? "text-amber-500" : "text-red-500"}`}>{pctS}%</span>
                        </div>
                        <span className="text-center text-sm font-semibold text-emerald-600">{s.correct}</span>
                        <span className="text-center text-sm font-semibold text-red-500">{s.wrong}</span>
                        <span className="text-center text-sm font-semibold text-muted-foreground">{s.skipped}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Analysis Tab */}
          <TabsContent value="time" className="mt-6">
            <Card className="rounded-2xl border-border/60">
              <CardHeader className="pb-2 pt-5 px-6">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Time per Question Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={timeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)" }} />
                    <Bar dataKey="questions" name="Questions" radius={[6, 6, 0, 0]}>
                      {timeData.map((_, i) => (
                        <Cell key={i} fill={`oklch(${0.54 + i * 0.04} 0.22 ${280 - i * 10})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Insights Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-3xl border-primary/20 overflow-hidden">
            <div
              className="h-1"
              style={{ background: "linear-gradient(90deg, oklch(0.54 0.22 280), oklch(0.60 0.20 240))" }}
            />
            <CardHeader className="pt-6 px-6 pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-foreground">AI Insights</p>
                  <p className="text-xs text-muted-foreground font-normal">Personalized feedback powered by Gemini</p>
                </div>
                <Badge variant="secondary" className="ml-auto text-xs bg-primary/10 text-primary">
                  AI Generated
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loadingInsight ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-muted rounded-xl w-3/4" />
                  <div className="h-4 bg-muted rounded-xl w-full" />
                  <div className="h-4 bg-muted rounded-xl w-5/6" />
                  <div className="h-4 bg-muted rounded-xl w-2/3" />
                  <div className="h-4 bg-muted rounded-xl w-4/5" />
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {aiInsight.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <p key={i} className="font-bold text-foreground mt-4 mb-1">
                          {line.replace(/\*\*/g, "")}
                        </p>
                      );
                    }
                    if (line.startsWith("•")) {
                      return (
                        <p key={i} className="flex items-start gap-2 text-sm ml-2 text-muted-foreground mb-1">
                          <span className="text-primary mt-1 shrink-0">•</span>
                          {line.slice(1).trim()}
                        </p>
                      );
                    }
                    if (line.trim()) {
                      return <p key={i} className="text-sm text-foreground mb-2">{line}</p>;
                    }
                    return null;
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          <Link href="/tests" className="flex-1">
            <Button
              className="w-full rounded-2xl gradient-primary border-0 text-white font-bold gap-2 h-12"
            >
              <RotateCcw className="w-4 h-4" />
              Reattempt Test
            </Button>
          </Link>
          <Link href="/tests" className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-2xl font-bold gap-2 h-12 border-border/60"
            >
              Try Another Test
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button
              variant="ghost"
              className="w-full rounded-2xl font-bold gap-2 h-12"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
