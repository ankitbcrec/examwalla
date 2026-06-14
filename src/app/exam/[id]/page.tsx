"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { Question, QuestionStatus } from "@/types";

// Mock questions
const generateQuestions = (examId: string): Question[] =>
  Array.from({ length: 30 }, (_, i) => ({
    id: `q${i + 1}`,
    exam_id: examId,
    question_number: i + 1,
    question_text: getSampleQuestion(i),
    options: [
      { key: "A", text: getOption(i, 0) },
      { key: "B", text: getOption(i, 1) },
      { key: "C", text: getOption(i, 2) },
      { key: "D", text: getOption(i, 3) },
    ],
    correct_answer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
    section: i < 10 ? "Section A" : i < 20 ? "Section B" : "Section C",
    marks: 1,
  }));

function getSampleQuestion(i: number) {
  const questions = [
    "Which of the following is NOT a function of SEBI in regulating securities markets?",
    "A company's Price-to-Earnings (P/E) ratio is 20 and its EPS is ₹15. What is the market price of the share?",
    "Under the NISM Research Analyst Regulations, an analyst must disclose financial interest if it exceeds:",
    "Which ratio best measures a company's ability to pay short-term obligations?",
    "What is the primary difference between a futures contract and an options contract?",
    "In Discounted Cash Flow (DCF) analysis, what does WACC stand for?",
    "Which of the following is considered a 'safe harbor' provision for research analysts?",
    "The beta coefficient of a stock measures its sensitivity to:",
    "What is the standard settlement cycle for equity trades in Indian stock markets?",
    "A bond with a coupon rate higher than its YTM is trading at:",
  ];
  return questions[i % questions.length];
}

function getOption(i: number, opt: number) {
  const options = [
    ["Setting monetary policy", "Regulating stock exchanges", "Registering brokers", "Protecting investor interests"],
    ["₹200", "₹300", "₹150", "₹250"],
    ["1% of portfolio", "2% of portfolio", "5% of portfolio", "No disclosure needed"],
    ["Debt-to-equity ratio", "Current ratio", "Return on equity", "Gross margin"],
    ["Obligation vs right", "Both are obligations", "Both are rights", "No difference"],
    ["Weighted Average Cost of Capital", "Working Capital Cost", "Weighted Asset Cost Calculation", "Working Average Capital Cost"],
    ["Preparing research reports", "Trading on insider information", "Publishing recommendations", "Client communications"],
    ["Market risk", "Credit risk", "Liquidity risk", "Operational risk"],
    ["T+1", "T+2", "T+3", "T+0"],
    ["Premium", "Discount", "Par value", "Face value"],
  ];
  return options[i % options.length][opt];
}

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

interface SubmitModalProps {
  unanswered: number;
  onReview: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

function SubmitModal({ unanswered, onReview, onSubmit, onClose }: SubmitModalProps) {
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
        className="bg-card rounded-3xl shadow-2xl w-full max-w-sm border border-border/60 p-7 text-center"
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
            className="rounded-2xl font-semibold"
          >
            Review
          </Button>
          <Button
            onClick={onSubmit}
            className="rounded-2xl gradient-primary border-0 text-white font-bold"
          >
            Final Submit
          </Button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function ExamPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [questions] = useState<Question[]>(() => generateQuestions(params.id));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [statuses, setStatuses] = useState<Record<number, QuestionStatus>>(() =>
    Object.fromEntries(questions.map((_, i) => [i, "not_visited" as QuestionStatus]))
  );
  const [timeLeft, setTimeLeft] = useState(120 * 60);
  const [showSubmit, setShowSubmit] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const startTime = useRef(Date.now());

  const currentQ = questions[currentIdx];
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const markedCount = Object.values(statuses).filter(
    (s) => s === "marked_for_review" || s === "answered_and_marked"
  ).length;
  const unanswered = questions.length - answeredCount;

  // Mark current as "not_answered" when first visited
  useEffect(() => {
    setStatuses((prev) => {
      if (prev[currentIdx] === "not_visited") {
        return { ...prev, [currentIdx]: "not_answered" };
      }
      return prev;
    });
  }, [currentIdx]);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleSubmit = useCallback(() => {
    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
    const answeredAnswers = { ...answers };
    const correct = questions.filter(
      (q, i) => answeredAnswers[i] === q.correct_answer
    ).length;
    const wrong = Object.keys(answeredAnswers).length - correct;
    const score = Math.max(0, correct - wrong * 0.25);

    const resultData = {
      exam_id: params.id,
      score: Math.round(score),
      total_marks: questions.length,
      correct,
      wrong,
      skipped: questions.length - Object.keys(answeredAnswers).length,
      time_taken: timeTaken,
      accuracy: Math.round((correct / questions.length) * 100),
      percentile: Math.round(40 + Math.random() * 50),
    };

    sessionStorage.setItem("last_result", JSON.stringify(resultData));
    router.push(`/results/${params.id}`);
  }, [answers, questions, params.id, router]);

  const timerWarning = timeLeft < 300;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-4 md:px-6 h-14 bg-card border-b border-border/60 shrink-0 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm hidden sm:block">ExamWalla</span>
        </div>

        <div className="h-5 w-px bg-border mx-1" />

        {/* Exam name */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-foreground truncate">
            {params.id.replace(/-/g, " ").toUpperCase()}
          </span>
        </div>

        {/* Progress */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {answeredCount}/{questions.length} answered
          </div>
          <Progress
            value={(answeredCount / questions.length) * 100}
            className="w-24 h-2"
          />
        </div>

        {/* Timer */}
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

        {/* Palette toggle (mobile) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden rounded-xl"
        >
          {sidebarOpen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>

        {/* End test */}
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
                {/* Question header */}
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

                {/* Question text */}
                <div className="bg-card rounded-2xl border border-border/60 p-6 mb-6 shadow-sm">
                  <p className="text-base md:text-lg font-medium text-foreground leading-relaxed">
                    {currentQ.question_text}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((option, i) => {
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

                {/* Legend */}
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

              {/* Section labels & grid */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {["Section A", "Section B", "Section C"].map((section) => {
                  const sectionQs = questions.filter((q) => q.section === section);
                  const startIdx = questions.findIndex((q) => q.section === section);
                  return (
                    <div key={section}>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        {section}
                      </p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {sectionQs.map((_, qi) => {
                          const qIdx = startIdx + qi;
                          const status = statuses[qIdx];
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
                                isCurrent
                                  ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-110"
                                  : ""
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

              {/* Stats */}
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}
