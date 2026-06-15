"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, TrendingUp, Clock, Sparkles, Loader2 } from "lucide-react";
import {
  searchExams,
  POPULAR_EXAMS,
  CATEGORY_META,
  type ExamEntry,
} from "@/lib/exam-catalog";
import { cn } from "@/lib/utils";
import { logEvent } from "@/lib/event-logger";
import { SEARCH_CONFIG } from "@/config/search";
import type { ExamSuggestion } from "@/app/api/search-suggest/route";

interface ExamSearchProps {
  open: boolean;
  onClose: () => void;
}

// Convert an AI suggestion into the shape ResultRow expects
function suggestionToEntry(s: ExamSuggestion): ExamEntry {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    category: (s.category as ExamEntry["category"]) ?? "Other",
    emoji: s.emoji ?? "📝",
    difficulty: "Moderate",
    popular: false,
    tags: [],
  };
}

export default function ExamSearch({ open, onClose }: ExamSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [recent, setRecent] = useState<ExamEntry[]>([]);

  // AI suggestion state
  const [aiSuggestions, setAiSuggestions] = useState<ExamEntry[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSearched, setAiSearched] = useState(false); // true once we got a response for current query

  const staticResults = query.trim() ? searchExams(query) : POPULAR_EXAMS;

  // Show static results first; fall back to AI results when static are thin
  const useAI =
    SEARCH_CONFIG.AI_ENABLED &&
    query.trim().length >= SEARCH_CONFIG.AI_MIN_CHARS &&
    staticResults.length < SEARCH_CONFIG.AI_THRESHOLD;
  const results: Array<ExamEntry & { _ai?: boolean }> = useAI && aiSuggestions.length > 0
    ? [
        ...staticResults,
        ...aiSuggestions
          .filter((a) => !staticResults.some((s) => s.id === a.id))
          .map((a) => ({ ...a, _ai: true })),
      ]
    : staticResults;

  // Load recent searches
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
      setAiSuggestions([]);
      setAiLoading(false);
      setAiSearched(false);
    }
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Reset active index and AI state when query changes
  useEffect(() => {
    setActiveIdx(0);
    setAiSuggestions([]);
    setAiSearched(false);
  }, [query]);

  // Log search intent (800ms debounce)
  useEffect(() => {
    if (!query.trim()) return;
    const t = setTimeout(() => {
      logEvent("search_performed", "global", {
        query: query.trim(),
        result_count: results.length,
      });
    }, 800);
    return () => clearTimeout(t);
  }, [query, results.length]);

  // AI fallback — fires after debounce, only when static results are thin
  useEffect(() => {
    if (!useAI || aiSearched) return;
    const t = setTimeout(async () => {
      setAiLoading(true);
      try {
        const res = await fetch(`/api/search-suggest?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const { suggestions } = await res.json();
          setAiSuggestions(suggestions.map(suggestionToEntry));
        }
      } catch {
        // silent — static results remain visible
      } finally {
        setAiLoading(false);
        setAiSearched(true);
      }
    }, SEARCH_CONFIG.AI_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query, useAI, aiSearched]);

  const navigate = useCallback(
    (exam: ExamEntry & { _ai?: boolean }) => {
      try {
        const prev: ExamEntry[] = JSON.parse(
          localStorage.getItem("ew_recent_searches") ?? "[]"
        );
        const deduped = [exam, ...prev.filter((e) => e.id !== exam.id)].slice(0, 5);
        localStorage.setItem("ew_recent_searches", JSON.stringify(deduped));
      } catch {}

      // Store the full name so the exam page can use it for Gemini
      if (exam._ai) {
        try {
          sessionStorage.setItem(`exam_name_${exam.id}`, exam.name);
        } catch {}
      }

      logEvent("exam_selected", exam.id, {
        exam_name: exam.name,
        category: exam.category,
        query: query.trim() || null,
        source: exam._ai ? "ai" : "catalog",
      });

      onClose();
      router.push(`/exam/${exam.id}`);
    },
    [onClose, router, query]
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -12 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="pointer-events-auto w-full max-w-xl bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
                {aiLoading
                  ? <Loader2 className="w-5 h-5 text-primary shrink-0 animate-spin" />
                  : <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                }
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search any exam — nursing, JEE, barista, AWS…"
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

              {/* Recent searches */}
              {!query && recent.length > 0 && (
                <div className="px-3 pt-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Recent
                  </p>
                  {recent.map((exam) => (
                    <ResultRow key={exam.id} exam={exam} active={false} onClick={() => navigate(exam)} />
                  ))}
                  <div className="h-px bg-border/60 mx-2 my-2" />
                </div>
              )}

              {/* Results */}
              <div className="px-3 py-2 max-h-[58vh] overflow-y-auto">
                {!query && (
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" /> Popular Exams
                  </p>
                )}

                {/* AI section header — only shown when AI results are mixed in */}
                {query && useAI && aiSuggestions.length > 0 && staticResults.length > 0 && (
                  <p className="text-[11px] font-semibold text-violet-500 uppercase tracking-wider px-2 mt-3 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> AI Suggestions
                  </p>
                )}
                {query && useAI && aiSuggestions.length > 0 && staticResults.length === 0 && (
                  <p className="text-[11px] font-semibold text-violet-500 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> AI found these exams for you
                  </p>
                )}

                {/* Loading skeleton while AI thinks */}
                {aiLoading && staticResults.length < 4 && (
                  <div className="px-3 py-3 flex items-center gap-3 text-muted-foreground text-sm">
                    <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Searching with AI…</span>
                  </div>
                )}

                {results.length === 0 && !aiLoading ? (
                  <div className="py-10 text-center text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No exams found for &quot;{query}&quot;</p>
                    <p className="text-xs mt-1 opacity-60">Try a different keyword…</p>
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
                      isAI={!!(exam as ExamEntry & { _ai?: boolean })._ai}
                    />
                  ))
                )}

                {results.length > 0 && (
                  <p className="text-center text-[11px] text-muted-foreground py-2 mt-1 border-t border-border/40">
                    {results.length} result{results.length !== 1 ? "s" : ""} · ↑↓ navigate · Enter to start
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
  isAI = false,
}: {
  exam: ExamEntry;
  active: boolean;
  onClick: () => void;
  onHover?: () => void;
  query?: string;
  isAI?: boolean;
}) {
  const meta = CATEGORY_META[exam.category] ?? { bg: "bg-muted", color: "text-muted-foreground" };

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group",
        active ? "bg-primary/8 text-foreground" : "hover:bg-accent"
      )}
    >
      <span className="text-xl w-8 text-center shrink-0">{exam.emoji}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">
            {highlight(exam.name, query)}
          </span>
          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0", meta.bg, meta.color)}>
            {exam.category}
          </span>
          {isAI && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ml-auto bg-violet-50 text-violet-600 dark:bg-violet-950/40 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> AI
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{exam.description}</p>
      </div>

      <ArrowRight className={cn(
        "w-4 h-4 shrink-0 transition-all",
        active ? "text-primary opacity-100 translate-x-0" : "text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
      )} />
    </button>
  );
}
