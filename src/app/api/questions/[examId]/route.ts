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

// Detect dummy/fallback questions that snuck into cache from an earlier failed run
function isFallbackQuestion(q: { question_text?: string }): boolean {
  return (
    typeof q.question_text === "string" &&
    q.question_text.startsWith("Sample question")
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params;
  const refresh = req.nextUrl.searchParams.get("refresh") === "1";
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1 — Check cache (skipped if ?refresh=1 or if cached data is dummy)
  if (!refresh) {
    const { data: cached } = await supabase
      .from("cached_questions")
      .select("questions")
      .eq("exam_id", examId)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    const questions = cached?.questions as Array<{ question_text?: string }> | null;
    if (questions?.length && !isFallbackQuestion(questions[0])) {
      return NextResponse.json({ questions, source: "cache" });
    }

    if (questions?.length) {
      // Cache has dummy data — delete it and regenerate
      console.warn(`[questions/${examId}] Cached dummy data detected — regenerating`);
      await supabase.from("cached_questions").delete().eq("exam_id", examId);
    }
  }

  // 2 — Generate with Gemini
  const examName = EXAM_NAMES[examId] ?? examId.replace(/-/g, " ").toUpperCase();
  let questions;
  try {
    questions = await generateMockQuestions(examName, 20);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[questions/${examId}] Gemini failed:`, msg);
    return NextResponse.json(
      { error: `AI question generation failed: ${msg}` },
      { status: 502 }
    );
  }

  // 3 — Persist to cache (fire-and-forget)
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
