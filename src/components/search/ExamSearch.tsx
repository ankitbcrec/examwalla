"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, TrendingUp, Clock } from "lucide-react";
import {
  searchExams,
  POPULAR_EXAMS,
  CATEGORY_META,
  type ExamEntry,
} from "@/lib/exam-catalog";
import { cn } from "@/lib/utils";

interface ExamSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function ExamSearch({ open, onClose }: ExamSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [recent, setRecent] = useState<ExamEntry[]>([]);

  const results = query.trim() ? searchExams(query) : POPULAR_EXAMS;

  // Load recent searches from localStorage
  useEffect(() => {
    if (open) {
      try {
        const stored = localStorage.getItem("ew_recent_searches");
        if (stored) setRecent(JSON.parse(stored).slice(0, 3));
      } catch {}
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setActiveIdx(0);
    }
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Reset active index when results change
  useEffect(() => setActiveIdx(0), [query]);

  const navigate = useCallback(
    (exam: ExamEntry) => {
      // Save to recent
      try {
        const prev: ExamEntry[] = JSON.parse(
          localStorage.getItem("ew_recent_searches") ?? "[]"
        );
        const deduped = [exam, ...prev.filter((e) => e.id !== exam.id)].slice(0, 5);
        localStorage.setItem("ew_recent_searches", JSON.stringify(deduped));
      } catch {}
      onClose();
      router.push(`/exam/${exam.id}`);
    },
    [onClose, router]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[activeIdx]) {
        navigate(results[activeIdx]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, activeIdx, navigate]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -12 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="pointer-events-auto w-full max-w-xl bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Search input row */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search exams — SSC, NEET, CAT, IELTS..."
                  className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded-lg hover:bg-accent text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                  ESC
                </kbd>
              </div>

              {/* Recent searches (only when no query) */}
              {!query && recent.length > 0 && (
                <div className="px-3 pt-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Recent
                  </p>
                  {recent.map((exam) => (
                    <ResultRow
                      key={exam.id}
                      exam={exam}
                      active={false}
                      onClick={() => navigate(exam)}
                    />
                  ))}
                  <div className="h-px bg-border/60 mx-2 my-2" />
                </div>
              )}

              {/* Results */}
              <div className="px-3 py-2 max-h-[58vh] overflow-y-auto">
                {!query && (
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" />
                    Popular Exams
                  </p>
                )}

                {results.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No exams found for &quot;{query}&quot;</p>
                    <p className="text-xs mt-1">Try: SSC, NEET, JEE, IBPS, CAT, IELTS…</p>
                  </div>
                ) : (
                  results.map((exam, i) => (
                    <ResultRow
                      key={exam.id}
                      exam={exam}
                      active={i === activeIdx}
                      onClick={() => navigate(exam)}
                      onHover={() => setActiveIdx(i)}
                      query={query}
                    />
                  ))
                )}

                {results.length > 0 && (
                  <p className="text-center text-[11px] text-muted-foreground py-2 mt-1 border-t border-border/40">
                    {results.length} result{results.length !== 1 ? "s" : ""} ·
                    Use ↑ ↓ to navigate · Enter to start test
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-primary rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function ResultRow({
  exam,
  active,
  onClick,
  onHover,
  query = "",
}: {
  exam: ExamEntry;
  active: boolean;
  onClick: () => void;
  onHover?: () => void;
  query?: string;
}) {
  const meta = CATEGORY_META[exam.category];

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group",
        active ? "bg-primary/8 text-foreground" : "hover:bg-accent"
      )}
    >
      {/* Emoji */}
      <span className="text-xl w-8 text-center shrink-0">{exam.emoji}</span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">
            {highlight(exam.name, query)}
          </span>
          <span
            className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0",
              meta.bg,
              meta.color
            )}
          >
            {exam.category}
          </span>
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ml-auto",
              exam.difficulty === "Easy" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40",
              exam.difficulty === "Moderate" && "bg-amber-50 text-amber-600 dark:bg-amber-950/40",
              exam.difficulty === "Hard" && "bg-red-50 text-red-600 dark:bg-red-950/40",
              exam.difficulty === "Very Hard" && "bg-red-100 text-red-700 dark:bg-red-950/60"
            )}
          >
            {exam.difficulty}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {exam.description}
        </p>
      </div>

      {/* Arrow */}
      <ArrowRight
        className={cn(
          "w-4 h-4 shrink-0 transition-all",
          active
            ? "text-primary opacity-100 translate-x-0"
            : "text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
        )}
      />
    </button>
  );
}
