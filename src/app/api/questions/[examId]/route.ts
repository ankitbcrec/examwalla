import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { generateMockQuestions } from "@/lib/gemini";

const EXAM_NAMES: Record<string, string> = {
  "nism-xv": "NISM Series XV – Research Analyst",
  "nism-viii": "NISM Series VIII – Equity Derivatives",
  "aws-saa": "AWS Solutions Architect Associate",
  "java-cert": "Java Certification (OCP)",
  "python-cert": "Python Programming Certification",
  "upsc-prelims": "UPSC Prelims – General Studies",
  "ssc-cgl": "SSC CGL",
  "bank-po": "Bank PO – IBPS",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params;
  const supabase = await createSupabaseServer();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1 — Cache check (all 10K users hit this fast path after the first generation)
  const { data: cached } = await supabase
    .from("cached_questions")
    .select("questions")
    .eq("exam_id", examId)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (cached?.questions) {
    return NextResponse.json({ questions: cached.questions, source: "cache" });
  }

  // 2 — Cache miss: call Gemini (happens at most once per exam ever)
  const examName = EXAM_NAMES[examId] ?? examId.replace(/-/g, " ").toUpperCase();

  let questions;
  try {
    questions = await generateMockQuestions(examName, 30);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[questions/${examId}] Gemini generation failed:`, msg);
    return NextResponse.json(
      { error: `AI question generation failed: ${msg}` },
      { status: 502 }
    );
  }

  // 3 — Persist to cache (fire-and-forget — don't block response)
  supabase
    .from("cached_questions")
    .upsert(
      {
        exam_id: examId,
        exam_name: examName,
        questions,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "exam_id" }
    )
    .then(({ error }) => {
      if (error) console.warn("[questions] cache upsert failed:", error.message);
    });

  return NextResponse.json({ questions, source: "gemini" });
}
