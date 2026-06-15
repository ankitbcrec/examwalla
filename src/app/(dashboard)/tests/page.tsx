"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, BookOpen, BarChart2, Zap, ArrowRight, X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { Exam } from "@/types";

const allExams: Exam[] = [
  {
    id: "nism-xv",
    name: "NISM Series XV",
    description: "Research Analyst Certification – Capital markets, equity research, financial analysis",
    category: "Finance",
    total_questions: 100,
    duration_minutes: 120,
    difficulty: "Hard",
    negative_marking: true,
    negative_marks: 0.25,
    icon: "📈",
    tags: ["NISM", "Finance", "Equity"],
  },
  {
    id: "nism-viii",
    name: "NISM Series VIII",
    description: "Equity Derivatives – F&O markets, options strategies, risk management",
    category: "Finance",
    total_questions: 100,
    duration_minutes: 120,
    difficulty: "Hard",
    negative_marking: true,
    negative_marks: 0.25,
    icon: "📊",
    tags: ["NISM", "Derivatives", "F&O"],
  },
  {
    id: "aws-saa",
    name: "AWS Solutions Architect",
    description: "Associate level – Design scalable cloud solutions on Amazon Web Services",
    category: "Cloud",
    total_questions: 65,
    duration_minutes: 130,
    difficulty: "Medium",
    negative_marking: false,
    icon: "☁️",
    tags: ["AWS", "Cloud", "DevOps"],
  },
  {
    id: "java-cert",
    name: "Java Certification",
    description: "Oracle Certified Professional – Core Java, OOP, Collections, Streams",
    category: "Technology",
    total_questions: 50,
    duration_minutes: 90,
    difficulty: "Medium",
    negative_marking: false,
    icon: "☕",
    tags: ["Java", "Programming", "OCP"],
  },
  {
    id: "python-cert",
    name: "Python Programming",
    description: "PCEP/PCAP – Python essentials, data structures, functions, modules",
    category: "Technology",
    total_questions: 40,
    duration_minutes: 65,
    difficulty: "Easy",
    negative_marking: false,
    icon: "🐍",
    tags: ["Python", "Programming", "PCAP"],
  },
  {
    id: "upsc-prelims",
    name: "UPSC Prelims",
    description: "Civil Services Preliminary – GS Paper I & II (CSAT), current affairs",
    category: "Government",
    total_questions: 100,
    duration_minutes: 120,
    difficulty: "Hard",
    negative_marking: true,
    negative_marks: 0.33,
    icon: "🏛️",
    tags: ["UPSC", "GS", "CSAT"],
  },
  {
    id: "ssc-cgl",
    name: "SSC CGL",
    description: "Combined Graduate Level – Quant, Reasoning, English, General Awareness",
    category: "Government",
    total_questions: 100,
    duration_minutes: 60,
    difficulty: "Medium",
    negative_marking: true,
    negative_marks: 0.5,
    icon: "📝",
    tags: ["SSC", "Govt", "CGL"],
  },
  {
    id: "bank-po",
    name: "Bank PO",
    description: "IBPS PO – Reasoning, Quantitative Aptitude, English, General Awareness",
    category: "Banking",
    total_questions: 100,
    duration_minutes: 60,
    difficulty: "Medium",
    negative_marking: true,
    negative_marks: 0.25,
    icon: "🏦",
    tags: ["IBPS", "Banking", "PO"],
  },
];

const categories = ["All", "Finance", "Cloud", "Technology", "Government", "Banking"];

const difficultyConfig = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  Hard: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border-red-200 dark:border-red-800",
};

interface InstructionsModalProps {
  exam: Exam;
  onClose: () => void;
}

function InstructionsModal({ exam, onClose }: InstructionsModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-3xl shadow-2xl w-full max-w-lg border border-border/60"
      >
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 w-8 h-8 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{exam.icon}</div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{exam.name}</h2>
              <p className="text-sm text-muted-foreground">{exam.description}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Instructions */}
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
            Exam Instructions
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Questions", value: exam.total_questions, icon: BookOpen },
              { label: "Duration", value: `${exam.duration_minutes} min`, icon: Clock },
              { label: "Question Type", value: "MCQ (4 options)", icon: BarChart2 },
              {
                label: "Negative Marking",
                value: exam.negative_marking ? `-${exam.negative_marks} per wrong` : "None",
                icon: Zap,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-2xl bg-muted/50">
                <item.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4 space-y-2">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Important Notes</p>
            <ul className="space-y-1.5 text-xs text-amber-700 dark:text-amber-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                Timer starts immediately when you click Start Examination
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                Your progress is auto-saved every 30 seconds
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                Questions are AI-generated and curated for accuracy
              </li>
              {exam.negative_marking && (
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    Negative marking: {exam.negative_marks} marks deducted per wrong answer
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <Separator />

        <div className="p-6 pt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl"
          >
            Go Back
          </Button>
          <Link href={`/exam/${exam.id}`} className="flex-1">
            <Button className="w-full rounded-2xl gradient-primary border-0 text-white font-bold gap-2">
              Start Examination
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TestsPage() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Exam[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search.length > 0) {
      const filtered = allExams.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [search]);

  const filteredExams =
    activeCategory === "All"
      ? allExams
      : allExams.filter((e) => e.category === activeCategory);

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-foreground">Mock Test Centre</h1>
          <p className="text-muted-foreground">
            Choose from AI-powered exams or search for your certification
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => search && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Type your exam name... e.g. NISM, AWS, Python"
              className="w-full h-14 pl-12 pr-12 rounded-2xl border-2 border-border focus:border-primary focus:outline-none bg-card shadow-sm text-base transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl shadow-2xl border border-border/60 z-50 overflow-hidden"
              >
                {suggestions.map((exam) => (
                  <button
                    key={exam.id}
                    onMouseDown={() => {
                      setSelectedExam(exam);
                      setSearch(exam.name);
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent text-left transition-colors border-b border-border/30 last:border-0"
                  >
                    <span className="text-2xl">{exam.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{exam.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{exam.description}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2 flex-wrap"
        >
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl font-medium transition-all ${
                activeCategory === cat
                  ? "gradient-primary border-0 text-white shadow-md"
                  : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat}
            </Button>
          ))}
        </motion.div>

        {/* Exam cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredExams.map((exam, i) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <Card
                className="group h-full rounded-2xl border-border/60 hover:border-primary/40 hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden"
                onClick={() => setSelectedExam(exam)}
              >
                {/* Top accent */}
                <div
                  className="h-1 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(90deg, oklch(0.54 0.22 280), oklch(0.60 0.20 240))",
                  }}
                />
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="mb-3">
                    <div className="text-4xl">{exam.icon}</div>
                  </div>

                  {/* Name + description */}
                  <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {exam.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                    {exam.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {exam.total_questions}Q
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {exam.duration_minutes}m
                    </span>
                    {exam.negative_marking && (
                      <span className="text-red-500 font-medium">–{exam.negative_marks}</span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {exam.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] rounded-lg">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    className="w-full rounded-xl gradient-primary border-0 text-white font-semibold group-hover:shadow-md transition-all"
                    size="sm"
                  >
                    Start Test
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Or type custom exam */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-muted/50 border border-border/50">
            <Zap className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Don&#39;t see your exam?</p>
              <p className="text-xs text-muted-foreground">
                Type any exam name in the search above — AI will generate a custom test for you instantly
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90" />
          </div>
        </motion.div>
      </div>

      {/* Instructions Modal */}
      <AnimatePresence>
        {selectedExam && (
          <InstructionsModal exam={selectedExam} onClose={() => setSelectedExam(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
