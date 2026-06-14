"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Brain, Target, Zap, Clock, BookOpen } from "lucide-react";

interface ExamLoadingScreenProps {
  examId: string;
  examName: string;
}

// Exam-specific tips and facts
const EXAM_CONTENT: Record<string, { tips: string[]; facts: string[] }> = {
  "ssc-cgl": {
    tips: [
      "Attempt General Awareness first — it takes the least time and boosts confidence.",
      "Skip difficult questions and return later. Never stare at one question too long.",
      "Each section auto-closes at 15 minutes. Don't waste time on a single question.",
      "Wrong answers cost –0.5 marks. Skip if less than 60% confident.",
      "Reasoning and English are scoring sections — attempt all questions here.",
      "Read the question twice before looking at options to avoid misreading.",
    ],
    facts: [
      "SSC CGL has 100 questions across 4 sections in just 60 minutes.",
      "Over 30 lakh students appear for SSC CGL every year.",
      "You get 36 seconds per question on average — pace yourself!",
      "Tier 1 is qualifying — your Tier 2 marks decide your final rank.",
      "English Comprehension and Reasoning are the highest-scoring sections.",
    ],
  },
  "rrb-ntpc": {
    tips: [
      "General Awareness has 40 questions — the highest weightage. Start here.",
      "Focus on Indian Railways facts, current affairs and static GK.",
      "Negative marking is –1/3. Skip if unsure — don't guess blindly.",
      "Reasoning section is scoring; it follows patterns — stay calm and systematic.",
      "Solve Mathematics using shortcuts like approximation and elimination.",
    ],
    facts: [
      "RRB NTPC CBT 1 has 100 questions in 90 minutes = 54 sec per question.",
      "General Awareness alone accounts for 40% of the paper.",
      "Negative marking is 1/3 of a mark — attempt when 75%+ confident.",
      "Over 1.25 crore candidates applied for RRB NTPC 2024 cycle.",
    ],
  },
  "neet-ug": {
    tips: [
      "Start with Biology — it carries 50% of total marks (360 out of 720).",
      "NCERT is your bible. 80% of NEET questions are directly from NCERT.",
      "Wrong answer costs –1 mark. Attempt only if you can eliminate 2 options.",
      "In Chemistry, Organic reactions and named reactions are high-yield.",
      "Physics numericals: write formula first, then substitute values carefully.",
      "Don't leave Biology diagrams — they appear as questions frequently.",
    ],
    facts: [
      "NEET 2024 had 24 lakh+ registered candidates for 1 lakh MBBS seats.",
      "Biology = 360 marks (90 Q), Chemistry = 180 marks, Physics = 180 marks.",
      "A score of 550+ puts you in top 10% of all NEET aspirants.",
      "Negative marking is –1 per wrong answer. Your net strategy matters.",
      "NEET is the sole entrance for MBBS / BDS / AYUSH across India.",
    ],
  },
  "jee-main": {
    tips: [
      "Attempt Chemistry first — it's the most scoring and least time-consuming.",
      "In Numerical Value questions, there is NO negative marking. Attempt all.",
      "For Physics, identify the concept before plugging numbers.",
      "Skip MCQs where you can eliminate only 1 option — negative marking applies.",
      "Maths needs practice — time allocation is key (50-55 min for Maths).",
    ],
    facts: [
      "JEE Main 2024 was attempted by 13 lakh+ students. Top 2.5 lakh qualify for Advanced.",
      "MCQs carry –1 for wrong answers. Numerical Value questions have no negative marking.",
      "Each of the 3 subjects has 20 MCQs + 10 Numerical (attempt 5) = 30 per subject.",
      "A percentile of 99+ requires roughly 200+/300 marks.",
    ],
  },
  "upsc-prelims": {
    tips: [
      "Read every option carefully — UPSC is known for 'most appropriate' type traps.",
      "Eliminate wrong options first. Even eliminating 2 boosts your accuracy significantly.",
      "Current Affairs from the past 12 months are crucial. Static GK alone won't suffice.",
      "Never guess in the dark — negative marking is –0.67 per wrong answer.",
      "Polity and Environment are consistently high-weightage areas in recent papers.",
      "CSAT is qualifying (33% = 66/200). Don't over-prepare it at cost of GS.",
    ],
    facts: [
      "Only 1-2% of candidates who appear for Prelims make it to Mains.",
      "UPSC Prelims GS Paper 1 has 100 questions in 120 minutes = 72 sec per question.",
      "The cutoff fluctuates between 98–115 marks (out of 200) each year.",
      "Static GK + Current Affairs = the winning combination for GS Paper 1.",
    ],
  },
  "cat": {
    tips: [
      "VARC: Read the passage once carefully before looking at questions.",
      "DILR: Identify the easiest set first. Leave complex sets for later.",
      "TITA questions (no options) have zero negative marking — always attempt them.",
      "Section timer is strict — you cannot revisit the previous section.",
      "In QA, attempt formula-based questions before concept-heavy ones.",
      "CAT rewards accuracy over speed — 60% attempted with 95% accuracy beats 90% attempted.",
    ],
    facts: [
      "CAT 2024 had 68 questions across 3 sections in 120 minutes (40 min each).",
      "IIM Ahmedabad cutoff: 99.5+ percentile. Top 20 IIMs need 95+ percentile.",
      "TITA questions (Type In The Answer) have no negative marking.",
      "Only 4,000–5,000 students get into IIM A/B/C from 3+ lakh CAT applicants.",
    ],
  },
  "ibps-po": {
    tips: [
      "English Language: Read comprehension passages quickly but carefully.",
      "Quantitative Aptitude: DI sets are scoring — attempt these first.",
      "Reasoning: Linear puzzles and seating arrangements are always present.",
      "Banking Awareness is crucial for Mains — read RBI policies and current rates.",
      "Prelims is qualifying only. Focus your real energy on Mains preparation.",
    ],
    facts: [
      "IBPS PO Prelims: 100 questions, 60 minutes with 20-min sectional limits.",
      "Each section has individual time limits — you cannot move back.",
      "Negative marking is –0.25 per wrong answer.",
      "Final selection includes an interview worth 100 marks (20% weight).",
    ],
  },
  "ielts": {
    tips: [
      "Reading: Skim headings first, then scan for specific answers.",
      "Don't spend more than 20 minutes on any one passage in Reading.",
      "True/False/Not Given: 'Not Given' means information is absent — not false.",
      "Writing Task 2 carries more marks than Task 1 — plan it well.",
      "Use synonyms and paraphrasing — don't copy words from the passage.",
    ],
    facts: [
      "IELTS has 4 sections: Listening (40 Q), Reading (40 Q), Writing (2 tasks), Speaking.",
      "Band scores range from 0–9 in 0.5 increments. Most UK universities need 6.5+.",
      "Reading has 60 minutes for 40 questions = 90 seconds per question.",
      "Over 3 million IELTS tests are taken globally every year.",
    ],
  },
  "sat": {
    tips: [
      "Reading & Writing: Each question has its own short passage — read it fully.",
      "Math: Calculator is allowed in all questions in the digital SAT.",
      "No negative marking — always answer every question, even if guessing.",
      "Module 2 is harder if you performed well in Module 1. That's good!",
      "Grid-in answers: no negative marking. Write your best answer always.",
    ],
    facts: [
      "Digital SAT 2024: 98 questions in 2 hours 14 minutes.",
      "Score range: 400–1600. Most top US universities need 1400+.",
      "The SAT is adaptive — Module 2 difficulty adjusts to your Module 1 performance.",
      "No penalty for wrong answers. Blank = wrong, so always guess.",
    ],
  },
  "cuet-ug": {
    tips: [
      "Focus on NCERT books for domain subjects — questions are syllabus-aligned.",
      "General Test includes General Knowledge and Reasoning — both are scoring.",
      "Attempt all Language section questions — comprehension passages are direct.",
      "Negative marking is –1 per wrong answer with +5 for correct. Accuracy wins.",
      "Each subject exam is 45 minutes. Manage your attempt wisely.",
    ],
    facts: [
      "CUET UG is now mandatory for central university admissions across India.",
      "Marking: +5 for correct, –1 for wrong. One correct cancels 5 wrong answers.",
      "Over 15 lakh students appeared for CUET UG 2024.",
      "You can choose up to 6 domain subjects in CUET UG.",
    ],
  },
};

const DEFAULT_CONTENT = {
  tips: [
    "Read each question carefully before looking at the options.",
    "Attempt easy questions first to build confidence and save time.",
    "Use elimination: even ruling out 2 wrong options improves your odds.",
    "Keep track of time — don't spend more than 90 seconds on any question.",
    "Review marked questions if time permits — first instinct is often correct.",
    "Breathe. Stay calm. A relaxed mind recalls better than an anxious one.",
  ],
  facts: [
    "Consistent practice is more effective than last-minute cramming.",
    "The top performers don't attempt every question — they attempt wisely.",
    "Mock tests like this one are proven to improve real exam scores by 15-20%.",
    "Your brain needs oxygen — breathe deeply to improve focus and recall.",
  ],
};

const PHASE_LABELS = [
  "Analyzing syllabus...",
  "Structuring sections...",
  "Generating questions...",
  "Adding answer choices...",
  "Verifying accuracy...",
  "Almost ready...",
];

export default function ExamLoadingScreen({ examId, examName }: ExamLoadingScreenProps) {
  const content = EXAM_CONTENT[examId] ?? DEFAULT_CONTENT;
  const [tipIdx, setTipIdx] = useState(0);
  const [phase, setPhase] = useState(0);
  const [breathe, setBreathe] = useState<"in" | "hold" | "out">("in");
  const [elapsed, setElapsed] = useState(0);

  // Rotate tips every 5 seconds
  useEffect(() => {
    const t = setInterval(() => {
      setTipIdx((i) => (i + 1) % content.tips.length);
    }, 5000);
    return () => clearInterval(t);
  }, [content.tips.length]);

  // Advance generation phase label every 7 seconds
  useEffect(() => {
    const t = setInterval(() => {
      setPhase((p) => Math.min(p + 1, PHASE_LABELS.length - 1));
    }, 7000);
    return () => clearInterval(t);
  }, []);

  // Breathing cycle: 4s in → 2s hold → 4s out
  useEffect(() => {
    const cycle = [
      { state: "in" as const, duration: 4000 },
      { state: "hold" as const, duration: 2000 },
      { state: "out" as const, duration: 4000 },
    ];
    let i = 0;
    const run = () => {
      setBreathe(cycle[i].state);
      return setTimeout(() => {
        i = (i + 1) % cycle.length;
        timer = run();
      }, cycle[i].duration);
    };
    let timer = run();
    return () => clearTimeout(timer);
  }, []);

  // Elapsed seconds counter
  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const breatheLabel =
    breathe === "in" ? "Breathe In" : breathe === "hold" ? "Hold" : "Breathe Out";
  const breatheScale = breathe === "in" ? 1.35 : breathe === "hold" ? 1.35 : 1;
  const breatheOpacity = breathe === "out" ? 0.5 : 0.9;

  // Exam facts cycle
  const factIdx = Math.floor(elapsed / 8) % content.facts.length;

  return (
    <div className="flex flex-col min-h-screen bg-[oklch(0.12_0.04_280)] text-white overflow-hidden">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center gap-3 px-6 py-4 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white/90">ExamWalla</span>
        <div className="flex-1" />
        <span className="text-xs text-white/40 font-mono">
          {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
        </span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 gap-10">

        {/* Exam name */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-white/50 text-sm font-medium mb-1 uppercase tracking-widest">
            Preparing for
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-white">{examName}</h1>
        </motion.div>

        {/* Breathing orb — the focal point */}
        <div className="relative flex items-center justify-center w-52 h-52">
          {/* Outer pulse rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border border-violet-400/20"
              animate={{
                scale: breathe === "in" ? [1, 1.5 + ring * 0.15] : [1.5 + ring * 0.15, 1],
                opacity: breathe === "in" ? [0.3, 0] : [0, 0.3],
              }}
              transition={{
                duration: breathe === "in" ? 4 : 4,
                delay: ring * 0.3,
                ease: "easeOut",
              }}
              style={{ width: `${100 + ring * 30}%`, height: `${100 + ring * 30}%` }}
            />
          ))}

          {/* Main orb */}
          <motion.div
            animate={{
              scale: breatheScale,
              opacity: breatheOpacity,
            }}
            transition={{
              duration: breathe === "hold" ? 0.3 : 4,
              ease: breathe === "in" ? "easeIn" : breathe === "out" ? "easeOut" : "linear",
            }}
            className="w-40 h-40 rounded-full flex flex-col items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, oklch(0.65 0.25 280), oklch(0.45 0.28 260))",
              boxShadow:
                "0 0 60px oklch(0.54 0.22 280 / 0.5), 0 0 120px oklch(0.54 0.22 280 / 0.2)",
            }}
          >
            <Brain className="w-8 h-8 text-white/80 mb-1" />
            <AnimatePresence mode="wait">
              <motion.span
                key={breatheLabel}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-xs font-bold text-white/90 uppercase tracking-wider"
              >
                {breatheLabel}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Exam tip card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Exam Tip
              </span>
              <span className="ml-auto text-xs text-white/30">
                {tipIdx + 1}/{content.tips.length}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIdx}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.4 }}
                className="text-sm text-white/80 leading-relaxed"
              >
                {content.tips[tipIdx]}
              </motion.p>
            </AnimatePresence>

            {/* Tip progress dots */}
            <div className="flex gap-1 mt-3">
              {content.tips.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === tipIdx
                      ? "bg-amber-400 flex-1"
                      : "bg-white/20 w-3"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-400/20 flex items-center justify-center shrink-0 mt-0.5">
              <Target className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Did you know?
              </span>
              <AnimatePresence mode="wait">
                <motion.p
                  key={factIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-xs text-white/70 leading-relaxed"
                >
                  {content.facts[factIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Generation status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-white/50 text-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <AnimatePresence mode="wait">
              <motion.span
                key={phase}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {PHASE_LABELS[phase]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Animated dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-400"
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-white/30 text-xs">
            <Clock className="w-3 h-3" />
            <span>
              {elapsed < 15
                ? "Gemini AI is generating your questions — takes about 30 seconds"
                : elapsed < 35
                ? "Almost there — building your personalized question set"
                : "Just a few more seconds..."}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
