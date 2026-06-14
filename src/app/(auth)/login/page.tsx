"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Trophy, Sparkles, BarChart3, Clock, Target, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

const features = [
  { icon: Sparkles, text: "AI-Generated Questions", color: "text-violet-500 bg-violet-100 dark:bg-violet-950/40" },
  { icon: BarChart3, text: "Detailed Analytics", color: "text-blue-500 bg-blue-100 dark:bg-blue-950/40" },
  { icon: Target, text: "Accuracy Tracking", color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-950/40" },
  { icon: Clock, text: "Timed Mock Tests", color: "text-amber-500 bg-amber-100 dark:bg-amber-950/40" },
  { icon: Trophy, text: "Percentile Ranking", color: "text-rose-500 bg-rose-100 dark:bg-rose-950/40" },
  { icon: Zap, text: "Instant AI Feedback", color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-950/40" },
];

const examCategories = [
  { emoji: "📈", name: "NISM Series" },
  { emoji: "☁️", name: "AWS Certs" },
  { emoji: "🏛️", name: "UPSC" },
  { emoji: "🏦", name: "Bank PO" },
  { emoji: "🐍", name: "Python" },
  { emoji: "☕", name: "Java" },
  { emoji: "📝", name: "SSC CGL" },
  { emoji: "🎓", name: "Academics" },
];

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setError(error.message);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex flex-col w-[55%] relative overflow-hidden p-12"
        style={{
          background: "linear-gradient(135deg, oklch(0.30 0.20 285) 0%, oklch(0.38 0.22 270) 40%, oklch(0.44 0.20 250) 100%)",
        }}
      >
        {/* BG pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating orbs */}
        {[
          { size: "w-72 h-72", pos: "-top-20 -right-20", delay: 0 },
          { size: "w-48 h-48", pos: "bottom-20 -left-10", delay: 2 },
          { size: "w-32 h-32", pos: "top-1/2 right-10", delay: 4 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
            className={`absolute ${orb.size} ${orb.pos} rounded-full`}
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)" }}
          />
        ))}

        <div className="relative flex-1 flex flex-col">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">ExamWalla</h1>
              <p className="text-white/60 text-xs">AI Mock Test Platform</p>
            </div>
          </motion.div>

          {/* Hero text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Ace Your Exams with<br />
              <span className="text-white/80">AI-Powered</span> Practice
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Join thousands of students using ExamWalla to prepare smarter, not harder. Real exam-style questions, instant feedback, and detailed analytics.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-3 mb-10"
          >
            {features.map((feat, i) => (
              <motion.div
                key={feat.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/15"
              >
                <feat.icon className="w-4 h-4 text-white/80 shrink-0" />
                <span className="text-white text-sm font-medium">{feat.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Exam category bubbles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-auto"
          >
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Available Exams</p>
            <div className="flex flex-wrap gap-2">
              {examCategories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 + i * 0.04 }}
                  className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 border border-white/15"
                >
                  <span className="text-sm">{cat.emoji}</span>
                  <span className="text-white/80 text-xs font-medium">{cat.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground">ExamWalla</h1>
              <p className="text-muted-foreground text-xs">AI Mock Test Platform</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-foreground mb-2">Welcome back 👋</h2>
            <p className="text-muted-foreground">
              Sign in to continue your exam preparation journey
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <motion.div whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}>
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-14 rounded-2xl border-2 border-border/60 bg-card text-foreground hover:bg-accent hover:border-primary/30 font-semibold text-base shadow-sm gap-3 transition-all duration-200 disabled:opacity-70"
              variant="outline"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              {loading ? "Redirecting to Google..." : "Continue with Google"}
            </Button>
          </motion.div>

          {/* Divider */}
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
              or
            </span>
          </div>

          {/* Demo access */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Link href="/dashboard">
              <Button
                className="w-full h-14 rounded-2xl gradient-primary border-0 text-white font-bold text-base gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Explore Demo (No Login)
              </Button>
            </Link>
          </motion.div>

          {/* Trust signals */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { value: "10K+", label: "Students" },
              { value: "50+", label: "Exam Types" },
              { value: "1M+", label: "Questions" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-black text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Terms */}
          <p className="mt-8 text-xs text-muted-foreground text-center">
            By continuing, you agree to our{" "}
            <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Separator() {
  return <div className="h-px bg-border w-full" />;
}
