"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, BookOpen, Trash2, Play } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const initialBookmarks = [
  { id: "1", name: "NISM Series XV", category: "Finance", icon: "📈", questions: 100, saved: "2025-06-10" },
  { id: "2", name: "AWS Solutions Architect", category: "Cloud", icon: "☁️", questions: 65, saved: "2025-06-08" },
  { id: "3", name: "Python Programming", category: "Tech", icon: "🐍", questions: 40, saved: "2025-06-05" },
];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Bookmarks</h1>
        <p className="text-muted-foreground text-sm">Your saved exams for quick access</p>
      </motion.div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground mb-1">No bookmarks yet</p>
          <p className="text-sm text-muted-foreground mb-4">Save exams from the Mock Tests page</p>
          <Link href="/tests">
            <Button className="rounded-xl gradient-primary border-0 text-white">Browse Tests</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bm, i) => (
            <motion.div
              key={bm.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="rounded-2xl border-border/60 hover:border-primary/30 transition-colors">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="text-3xl">{bm.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{bm.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{bm.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {bm.questions} Questions
                      </span>
                      <span className="text-xs text-muted-foreground">Saved {bm.saved}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/exam/${bm.id}`}>
                      <Button size="sm" className="rounded-xl gradient-primary border-0 text-white gap-1.5 text-xs">
                        <Play className="w-3.5 h-3.5" /> Start
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setBookmarks((b) => b.filter((x) => x.id !== bm.id))}
                      className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
