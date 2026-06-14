"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  SkipForward,
  CheckCircle,
  AlertCircle,
  X,
  GraduationCap,
  Maximize2,
  Minimize2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { Question, QuestionStatus } from "@/types";

const EXAM_NAMES: Record<string, string> = {
  "nism-xv": "NISM Series XV",
  "nism-viii": "NISM Series VIII",
  "aws-saa": "AWS Solutions Architect",
  "java-cert": "Java OCP Certification",
  "python-cert": "Python Certification",
  "upsc-prelims": "UPSC Prelims",
  "ssc-cgl": "SSC CGL",
  "bank-po": "Bank PO – IBPS",
};

const paletteColors: Record<QuestionStatus, { bg: string; text: string; label: string }> = {
  not_visited: { bg: "bg-muted hover:bg-muted/80", text: "text-muted-foreground", label: "Not Visited" },
  answered: { bg: "bg-emerald-500 hover:bg-emerald-600", text: "text-white", label: "Answered" },
  not_answered: { bg: "bg-red-400 hover:bg-red-500", text: "text-white", label: "Not Answered" },
  marked_for_review: { bg: "bg-amber-400 hover:bg-amber-500", text: "text-white", label: "Marked for Review" },
  answered_and_marked: { bg: "bg-violet-500 hover:bg-violet-600", text: "text-white", label: "Answered & Marked" },
};

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function LoadingScreen({ examName }: { examName: string }) {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-background gap-6">
      <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
        <GraduationCap className="w-7 h-7 text-white" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">{examName}</h2>
        <p className="text-muted-foreground text-sm mb-6">Preparing your AI-generated questions...</p>
        <div className="flex items-center gap-2 justify-center text-primary">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Generating with Gemini AI</span>
        </div>
      </div>
    </div>
  );
}

interface SubmitModalProps {
  unanswered: number;
  onReview: () => void;
  onSubmit: () => void;
  onClose: () => void;
  submitting: boolean;
}

function SubmitModal({ unanswered, onReview, onSubmit, onClose, submitting }: SubmitModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative bg-card rounded-3xl shadow-2xl w-full max-w-sm border border-border/60 p-7 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-2">Submit Test?</h2>
        {unanswered > 0 ? (
          <p className="text-muted-foreground mb-6">
            You still have{" "}
            <span className="font-bold text-amber-500">{unanswered} unanswered</span>{" "}
            {unanswered === 1 ? "question" : "questions"}. Are you sure you want to submit?
          </p>
        ) : (
          <p className="text-muted-foreground mb-6">
            You've answered all questions. Ready to submit?
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onReview}
            disabled={submitting}
            className="rounded-2xl font-semibold"
          >
            Review
          </Button>
          <Button
            onClick={onSubmit}
            disabled={submitting}
            className="rounded-2xl gradient-primary border-0 text-white font-bold gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {submitting ? "Saving..." : "Final Submit"}
          </Button>
        </div>

        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: examId } = use(params);
  const examName = EXAM_NAMES[examId] ?? examId.replace(/-/g, " ").toUpperCase();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [statuses, setStatuses] = useState<Record<number, QuestionStatus>>({});
  const [timeLeft, setTimeLeft] = useState(120 * 60);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const startTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionCreated = useRef(false);

  // Fetch questions from API (Gemini-generated, cached in Supabase)
  // Then immediately create a session record so the attempt is tracked from start
  useEffect(() => {
    fetch(`/api/questions/${examId}`)
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error ?? `HTTP ${r.status}`);
        return json;
      })
      .then(async ({ questions: raw }) => {
        const mapped: Question[] = raw.map(
          (q: {
            question_text: string;
            options: { key: string; text: string }[];
            correct_answer: string;
            explanation?: string;
            section?: string;
          }, i: number) => ({
            id: `q${i + 1}`,
            exam_id: examId,
            question_number: i + 1,
            question_text: q.question_text,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            section: q.section ?? `Section ${Math.floor(i / 10) + 1}`,
            marks: 1,
          })
        );
        setQuestions(mapped);
        setStatuses(
          Object.fromEntries(mapped.map((_, i) => [i, "not_visited" as QuestionStatus]))
        );
        startTime.current = Date.now();

        // Create a session record immediately — saves exam_id, exam_name, questions, started_at
        if (!sessionCreated.current) {
          sessionCreated.current = true;
          try {
            const sessRes = await fetch("/api/sessions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                exam_id: examId,
                exam_name: examName,
                questions: raw,           // raw from Gemini (includes correct_answer, explanation)
                total_questions: mapped.length,
              }),
            });
            if (sessRes.ok) {
              const { id } = await sessRes.json();
              setSessionId(id);
            }
          } catch {
            // Non-fatal — submit will fall back to creating a new result record
          }
        }
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, [examId, examName]);

  const currentQ = questions[currentIdx];
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const markedCount = Object.values(statuses).filter(
    (s) => s === "marked_for_review" || s === "answered_and_marked"
  ).length;
  const unanswered = questions.length - answeredCount;

  // Mark current as "not_answered" when first visited
  useEffect(() => {
    if (questions.length === 0) return;
    setStatuses((prev) => {
      if (prev[currentIdx] === "not_visited") {
        return { ...prev, [currentIdx]: "not_answered" };
      }
      return prev;
    });
  }, [currentIdx, questions.length]);

  // Timer countdown — start only after questions loaded
  useEffect(() => {
    if (loading || questions.length === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          doSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [loading, questions.length]);

  const selectAnswer = (key: string) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: key }));
    setStatuses((prev) => ({
      ...prev,
      [currentIdx]:
        prev[currentIdx] === "marked_for_review" || prev[currentIdx] === "answered_and_marked"
          ? "answered_and_marked"
          : "answered",
    }));
  };

  const clearAnswer = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIdx];
      return next;
    });
    setStatuses((prev) => ({ ...prev, [currentIdx]: "not_answered" }));
  };

  const markForReview = () => {
    setStatuses((prev) => ({
      ...prev,
      [currentIdx]: answers[currentIdx] ? "answered_and_marked" : "marked_for_review",
    }));
    if (currentIdx < questions.length - 1) setCurrentIdx((i) => i + 1);
  };

  const saveAndNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx((i) => i + 1);
  };

  const doSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current!);

    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
    const correct = questions.filter((q, i) => answers[i] === q.correct_answer).length;
    const wrong = Object.keys(answers).length - correct;
    const score = Math.max(0, correct - wrong * 0.25);
    const accuracy = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    // Derive section breakdown
    const sections = [...new Set(questions.map((q) => q.section ?? "General"))];
    const sectionScores = sections.map((sec) => {
      const qs = questions.map((q, i) => ({ q, i })).filter(({ q }) => (q.section ?? "General") === sec);
      const secCorrect = qs.filter(({ q, i }) => answers[i] === q.correct_answer).length;
      const secWrong = qs.filter(({ q, i }) => answers[i] && answers[i] !== q.correct_answer).length;
      return {
        section: sec,
        correct: secCorrect,
        wrong: secWrong,
        total: qs.length,
        score: secCorrect,
        max_score: qs.length,
      };
    });

    const payload = {
      answers,                       // full answer map saved to history
      section_scores: sectionScores,
      score: Math.round(score),
      total_marks: questions.length,
      correct,
      wrong,
      skipped: questions.length - Object.keys(answers).length,
      time_taken: timeTaken,
      accuracy,
    };

    // Store in sessionStorage as fallback for results page
    sessionStorage.setItem("last_result", JSON.stringify({
      exam_id: examId,
      exam_name: examName,
      ...payload,
    }));

    try {
      // If a session was created on start, PATCH it with results
      // Otherwise fall back to creating a new result record
      let resultId: string | null = sessionId;

      if (sessionId) {
        const res = await fetch(`/api/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) resultId = null;
      }

      if (!resultId) {
        // Fallback: create via results route (no questions saved, but result still recorded)
        const res = await fetch("/api/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exam_id: examId, exam_name: examName, ...payload }),
        });
        if (res.ok) {
          const { id } = await res.json();
          resultId = id;
        }
      }

      router.push(resultId ? `/results/${resultId}` : `/results/${examId}`);
    } catch {
      router.push(`/results/${examId}`);
    }
  }, [answers, questions, examId, examName, sessionId, router, submitting]);

  const handleSubmit = () => doSubmit();

  const timerWarning = timeLeft < 300;

  if (loading) return <LoadingScreen examName={examName} />;

  if (loadError || questions.length === 0) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4 bg-background">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-foreground font-semibold">
          {loadError ? `Failed to load questions: ${loadError}` : "No questions found."}
        </p>
        <Button onClick={() => router.back()} className="rounded-xl gradient-primary border-0 text-white">
          Go Back
        </Button>
      </div>
    );
  }

  // Unique sections from questions
  const sections = [...new Set(questions.map((q) => q.section ?? "General"))];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-4 md:px-6 h-14 bg-card border-b border-border/60 shrink-0 shadow-sm">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm hidden sm:block">ExamWalla</span>
        </div>

        <div className="h-5 w-px bg-border mx-1" />

        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-foreground truncate">{examName}</span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {answeredCount}/{questions.length} answered
          </div>
          <Progress value={(answeredCount / questions.length) * 100} className="w-24 h-2" />
        </div>

        <motion.div
          animate={timerWarning ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: timerWarning ? Infinity : 0 }}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono font-bold text-sm shrink-0",
            timerWarning
              ? "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400"
              : "bg-muted text-foreground"
          )}
        >
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </motion.div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden rounded-xl"
        >
          {sidebarOpen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSubmit(true)}
          className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900 dark:hover:bg-red-950/30 font-semibold shrink-0"
        >
          End Test
        </Button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Question</span>
                    <span className="text-2xl font-bold text-foreground">{currentIdx + 1}</span>
                    <span className="text-sm text-muted-foreground">/ {questions.length}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {currentQ.section}
                  </Badge>
                  <Badge variant="outline" className="text-xs ml-auto">
                    +1 mark
                  </Badge>
                </div>

                <div className="bg-card rounded-2xl border border-border/60 p-6 mb-6 shadow-sm">
                  <p className="text-base md:text-lg font-medium text-foreground leading-relaxed">
                    {currentQ.question_text}
                  </p>
                </div>

                <div className="space-y-3">
                  {currentQ.options.map((option) => {
                    const isSelected = answers[currentIdx] === option.key;
                    return (
                      <motion.button
                        key={option.key}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => selectAnswer(option.key)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 md:p-5 rounded-2xl border-2 text-left transition-all duration-200",
                          isSelected
                            ? "border-primary bg-primary/8 shadow-md"
                            : "border-border/60 bg-card hover:border-primary/40 hover:bg-accent/40"
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all",
                            isSelected
                              ? "gradient-primary text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {option.key}
                        </div>
                        <span
                          className={cn(
                            "text-sm md:text-base font-medium",
                            isSelected ? "text-primary" : "text-foreground"
                          )}
                        >
                          {option.text}
                        </span>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-primary ml-auto shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom action bar */}
          <div className="border-t border-border/60 bg-card/80 backdrop-blur-sm px-4 md:px-8 py-3 flex items-center gap-3 shrink-0">
            <Button
              variant="ghost"
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className="rounded-xl gap-1.5 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>

            <div className="flex-1 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAnswer}
                disabled={!answers[currentIdx]}
                className="rounded-xl text-xs font-semibold"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={markForReview}
                className={cn(
                  "rounded-xl text-xs font-semibold",
                  statuses[currentIdx] === "marked_for_review" ||
                    statuses[currentIdx] === "answered_and_marked"
                    ? "border-amber-400 text-amber-600 bg-amber-50 dark:bg-amber-950/30"
                    : ""
                )}
              >
                <Flag className="w-3.5 h-3.5 mr-1" />
                Mark & Skip
              </Button>

              <Button
                size="sm"
                onClick={saveAndNext}
                disabled={currentIdx === questions.length - 1}
                className="rounded-xl text-xs font-semibold gradient-primary border-0 text-white gap-1"
              >
                Save & Next
                <SkipForward className="w-3.5 h-3.5" />
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
              disabled={currentIdx === questions.length - 1}
              className="rounded-xl gap-1.5 text-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="hidden md:flex flex-col bg-card border-l border-border/60 overflow-hidden shrink-0"
            >
              <div className="p-4 border-b border-border/60">
                <h3 className="font-bold text-sm text-foreground mb-3">Question Palette</h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.entries(paletteColors) as [QuestionStatus, typeof paletteColors[QuestionStatus]][]).map(
                    ([status, config]) => (
                      <div key={status} className="flex items-center gap-1.5">
                        <div className={`w-4 h-4 rounded ${config.bg} shrink-0`} />
                        <span className="text-[10px] text-muted-foreground leading-tight">
                          {config.label}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {sections.map((section) => {
                  const sectionQs = questions
                    .map((q, i) => ({ q, i }))
                    .filter(({ q }) => (q.section ?? "General") === section);
                  return (
                    <div key={section}>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide truncate">
                        {section}
                      </p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {sectionQs.map(({ i: qIdx }) => {
                          const status = statuses[qIdx] ?? "not_visited";
                          const config = paletteColors[status];
                          const isCurrent = qIdx === currentIdx;
                          return (
                            <motion.button
                              key={qIdx}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setCurrentIdx(qIdx)}
                              className={cn(
                                "w-full aspect-square rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                                config.bg,
                                config.text,
                                isCurrent ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-110" : ""
                              )}
                            >
                              {qIdx + 1}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border/60 bg-muted/30">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Answered", value: answeredCount, color: "text-emerald-500" },
                    { label: "Marked", value: markedCount, color: "text-amber-500" },
                    { label: "Pending", value: unanswered, color: "text-red-400" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => setShowSubmit(true)}
                  disabled={submitting}
                  className="w-full mt-3 rounded-xl gradient-primary border-0 text-white font-bold text-sm"
                >
                  Submit Test
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmit && (
          <SubmitModal
            unanswered={unanswered}
            onReview={() => setShowSubmit(false)}
            onSubmit={handleSubmit}
            onClose={() => setShowSubmit(false)}
            submitting={submitting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
