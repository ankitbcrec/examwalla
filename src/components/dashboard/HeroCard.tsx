"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, BookOpen, Trophy, Target } from "lucide-react";
import Link from "next/link";

interface HeroCardProps {
  userName?: string;
}

export default function HeroCard({ userName }: HeroCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-3xl p-8 md:p-10"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.54 0.22 280) 0%, oklch(0.58 0.22 255) 50%, oklch(0.60 0.20 240) 100%)",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
      />
      <motion.div
        animate={{ y: [8, -8, 8], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-16 right-32 w-32 h-32 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
      />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* Content */}
        <div className="flex-1 text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">AI-Powered Mock Tests</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold leading-tight mb-3"
          >
            {userName ? `Welcome back, ${userName.split(" ")[0]}! 👋` : "Ready to test your knowledge?"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/80 text-lg mb-8 max-w-lg"
          >
            Practice with AI-generated mock exams and track your progress toward your certification goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/tests">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-2xl font-bold text-base shadow-lg shadow-black/20 px-8"
              >
                Start Mock Test
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/analytics">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-2xl font-semibold text-base backdrop-blur-sm"
              >
                View Analytics
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="hidden md:flex flex-col items-center gap-4 shrink-0"
        >
          {/* Student with laptop illustration */}
          <div className="relative">
            <div className="w-44 h-44 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-36 h-36">
                {/* Laptop */}
                <rect x="30" y="100" width="120" height="70" rx="8" fill="white" fillOpacity="0.9"/>
                <rect x="40" y="108" width="100" height="55" rx="4" fill="oklch(0.54 0.22 280)"/>
                <rect x="25" y="170" width="130" height="8" rx="4" fill="white" fillOpacity="0.7"/>
                {/* Screen content */}
                <rect x="48" y="116" width="40" height="4" rx="2" fill="white" fillOpacity="0.6"/>
                <rect x="48" y="124" width="60" height="3" rx="1.5" fill="white" fillOpacity="0.4"/>
                <rect x="48" y="131" width="50" height="3" rx="1.5" fill="white" fillOpacity="0.4"/>
                {/* Chart on screen */}
                <rect x="100" y="118" width="8" height="16" rx="2" fill="white" fillOpacity="0.7"/>
                <rect x="112" y="122" width="8" height="12" rx="2" fill="white" fillOpacity="0.5"/>
                <rect x="124" y="114" width="8" height="20" rx="2" fill="white" fillOpacity="0.8"/>
                {/* Student head */}
                <circle cx="90" cy="55" r="30" fill="white" fillOpacity="0.9"/>
                {/* Face */}
                <circle cx="82" cy="52" r="3" fill="oklch(0.54 0.22 280)"/>
                <circle cx="98" cy="52" r="3" fill="oklch(0.54 0.22 280)"/>
                <path d="M82 63 Q90 70 98 63" stroke="oklch(0.54 0.22 280)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                {/* Graduation cap */}
                <rect x="65" y="28" width="50" height="6" rx="2" fill="oklch(0.35 0.18 270)"/>
                <polygon points="90,15 115,28 90,28 65,28" fill="oklch(0.35 0.18 270)"/>
                <line x1="115" y1="28" x2="118" y2="38" stroke="oklch(0.35 0.18 270)" strokeWidth="2"/>
                <circle cx="118" cy="39" r="3" fill="oklch(0.65 0.20 50)"/>
                {/* Body */}
                <path d="M60 85 Q90 90 120 85 L120 100 Q90 105 60 100 Z" fill="white" fillOpacity="0.7"/>
                {/* Stars / sparkles */}
                <text x="15" y="40" fontSize="16" fill="white" fillOpacity="0.8">✦</text>
                <text x="150" y="80" fontSize="12" fill="white" fillOpacity="0.6">✦</text>
                <text x="140" y="30" fontSize="20" fill="white" fillOpacity="0.7">⭐</text>
              </svg>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-3 -left-4 bg-white rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-foreground">Top 10%</span>
            </motion.div>

            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-3 -right-4 bg-white rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2"
            >
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-xs font-bold text-foreground">87% Accuracy</span>
            </motion.div>
          </div>

          {/* Mini stats */}
          <div className="flex gap-3">
            {[
              { icon: BookOpen, label: "Tests", value: "24" },
              { icon: Target, label: "Avg Score", value: "78%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2 border border-white/20"
              >
                <stat.icon className="w-4 h-4 text-white/80" />
                <div>
                  <p className="text-white font-bold text-sm leading-none">{stat.value}</p>
                  <p className="text-white/60 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
