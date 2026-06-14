"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import type { RecentTest } from "@/types";

interface RecentTestsProps {
  tests?: RecentTest[];
  loading?: boolean;
}

const mockTests: RecentTest[] = [
  {
    id: "1",
    exam_name: "NISM Series XV – Research Analyst",
    score: 78,
    total_marks: 100,
    accuracy: 82,
    time_taken_seconds: 4800,
    status: "completed",
    submitted_at: "2025-06-12T10:30:00Z",
  },
  {
    id: "2",
    exam_name: "NISM Series VIII – Equity Derivatives",
    score: 65,
    total_marks: 100,
    accuracy: 68,
    time_taken_seconds: 5400,
    status: "completed",
    submitted_at: "2025-06-10T14:20:00Z",
  },
  {
    id: "3",
    exam_name: "AWS Solutions Architect Associate",
    score: 88,
    total_marks: 100,
    accuracy: 91,
    time_taken_seconds: 3600,
    status: "completed",
    submitted_at: "2025-06-08T09:15:00Z",
  },
  {
    id: "4",
    exam_name: "Python Programming Certification",
    score: 92,
    total_marks: 100,
    accuracy: 95,
    time_taken_seconds: 2700,
    status: "completed",
    submitted_at: "2025-06-05T16:45:00Z",
  },
];

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
  if (score >= 60) return "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
  return "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
};

export default function RecentTests({ tests, loading }: RecentTestsProps) {
  const data = tests ?? mockTests;

  return (
    <Card className="rounded-2xl border-border/60 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 px-6 pt-5">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Recent Mock Tests
        </CardTitle>
        <Link href="/tests">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary rounded-xl gap-1 text-sm">
            View all
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted rounded" />
                </div>
                <div className="h-8 w-20 bg-muted rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_100px_90px_90px_90px_100px] gap-4 px-6 py-3 bg-muted/40 border-y border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <span>Test Name</span>
              <span className="text-center">Score</span>
              <span className="text-center">Accuracy</span>
              <span className="text-center">Time</span>
              <span className="text-center">Status</span>
              <span className="text-center">Action</span>
            </div>

            <div className="divide-y divide-border/50">
              {data.map((test, i) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="hidden md:grid grid-cols-[1fr_100px_90px_90px_90px_100px] gap-4 items-center px-6 py-4 hover:bg-accent/40 transition-colors group"
                >
                  {/* Test name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{test.exam_name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(test.submitted_at)}</p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex justify-center">
                    <span className={`text-sm font-bold ${getScoreColor(test.score)}`}>
                      {test.score}/{test.total_marks}
                    </span>
                  </div>

                  {/* Accuracy */}
                  <div className="flex justify-center">
                    <span className="text-sm font-semibold text-foreground">{test.accuracy}%</span>
                  </div>

                  {/* Time */}
                  <div className="flex justify-center">
                    <span className="text-sm text-muted-foreground">{formatTime(test.time_taken_seconds)}</span>
                  </div>

                  {/* Status */}
                  <div className="flex justify-center">
                    <Badge variant="outline" className={`text-xs font-semibold ${getScoreBg(test.score)}`}>
                      {test.status === "completed" ? (test.score >= 60 ? "Passed" : "Failed") : "In Progress"}
                    </Badge>
                  </div>

                  {/* Action */}
                  <div className="flex justify-center">
                    <Link href={`/results/${test.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Review
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}

              {/* Mobile cards */}
              {data.map((test, i) => (
                <motion.div
                  key={`mobile-${test.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="md:hidden flex items-start gap-3 px-4 py-4 hover:bg-accent/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate mb-1">{test.exam_name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className={`font-bold ${getScoreColor(test.score)}`}>{test.score}%</span>
                      <span>·</span>
                      <span>{test.accuracy}% accuracy</span>
                      <span>·</span>
                      <span>{formatTime(test.time_taken_seconds)}</span>
                    </div>
                  </div>
                  <Link href={`/results/${test.id}`}>
                    <Button size="sm" variant="outline" className="rounded-xl text-xs border-primary/30 text-primary shrink-0">
                      Review
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>

            {data.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-semibold text-foreground mb-1">No tests attempted yet</p>
                <p className="text-sm text-muted-foreground mb-4">Start your first mock test to see results here</p>
                <Link href="/tests">
                  <Button className="rounded-xl gradient-primary text-white">Start First Test</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
