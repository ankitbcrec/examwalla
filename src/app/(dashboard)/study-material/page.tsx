"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Clock, Star, Sparkles } from "lucide-react";

const materials = [
  {
    title: "NISM Series XV Study Guide",
    category: "Finance",
    type: "PDF",
    duration: "4h read",
    rating: 4.8,
    emoji: "📈",
    description: "Comprehensive guide covering all NISM Research Analyst modules",
  },
  {
    title: "AWS Solutions Architect Cheatsheet",
    category: "Cloud",
    type: "Notes",
    duration: "2h read",
    rating: 4.9,
    emoji: "☁️",
    description: "Key services, use cases and architectural patterns for SAA-C03",
  },
  {
    title: "Python Quick Reference",
    category: "Technology",
    type: "Notes",
    duration: "1h read",
    rating: 4.7,
    emoji: "🐍",
    description: "Core Python syntax, data structures, OOP and standard library",
  },
  {
    title: "UPSC GS Paper I Notes",
    category: "Government",
    type: "PDF",
    duration: "6h read",
    rating: 4.6,
    emoji: "🏛️",
    description: "History, Geography, Society topics for UPSC Prelims",
  },
];

export default function StudyMaterialPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Study Material</h1>
        <p className="text-muted-foreground text-sm">Curated resources to boost your preparation</p>
      </motion.div>

      {/* AI Study Tip */}
      <Card className="rounded-2xl border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">AI Recommendation</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Based on your recent test performance, focus on <span className="text-primary font-semibold">Risk Management</span> and <span className="text-primary font-semibold">Derivatives</span> study materials this week.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        {materials.map((mat, i) => (
          <motion.div
            key={mat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className="rounded-2xl border-border/60 hover:border-primary/30 hover:shadow-md transition-all group h-full">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{mat.emoji}</span>
                  <Badge variant="secondary" className="text-xs">{mat.type}</Badge>
                </div>
                <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{mat.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 flex-1">{mat.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <Badge variant="outline" className="text-[10px]">{mat.category}</Badge>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{mat.duration}</span>
                  <span className="flex items-center gap-1 text-amber-500 font-medium"><Star className="w-3 h-3 fill-amber-500" />{mat.rating}</span>
                </div>
                <Button size="sm" variant="outline" className="w-full rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary hover:text-white transition-all">
                  <BookOpen className="w-3.5 h-3.5" />
                  Read Now
                  <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
