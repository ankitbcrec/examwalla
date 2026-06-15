import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { generateMockQuestions } from "@/lib/gemini";
import { createLogger, uid } from "@/lib/logger";

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

function isFallbackQuestion(q: { question_text?: string }): boolean {
  return (
    typeof q.question_text === "string" &&
    q.question_text.startsWith("Sample question")
  );
}

// Repair any option whose text was stored under the wrong key (Gemini hallucination).
// e.g. {"D":"Developer Center","key":"C"} → {"key":"C","text":"Developer Center"}
function normalizeOptions(
  options: Array<Record<string, string>>
): { key: string; text: string }[] {
  return options.map((opt) => {
    if (opt.key && opt.text) return { key: opt.key, text: opt.text };
    const key = opt.key ?? "";
    const text =
      opt.text ??
      Object.entries(opt)
        .filter(([k]) => k !== "key")
        .map(([, v]) => v)
        .find(Boolean) ??
      "";
    return { key, text };
  });
}

function normalizeQuestions(
  questions: Array<Record<string, unknown>>
): Array<Record<string, unknown>> {
  return questions.map((q) => ({
    ...q,
    options: normalizeOptions(
      (q.options as Array<Record<string, string>>) ?? []
    ),
  }));
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params;
  const refresh = req.nextUrl.searchParams.get("refresh") === "1";
  const log = createLogger("GET /api/questions/[examId]");
  const reqTimer = log.timer();

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    log.warn("unauthenticated request", { exam_id: examId });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  log.info("request received", { exam_id: examId, user_id: uid(user.id), refresh });

  // 1 — Cache lookup
  if (!refresh) {
    const cacheTimer = log.timer();
    const { data: cached, error: cacheErr } = await supabase
      .from("cached_questions")
      .select("questions")
      .eq("exam_id", examId)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (cacheErr) {
      log.warn("cache lookup error", { exam_id: examId, error: cacheErr.message });
    }

    const questions = cached?.questions as Array<{ question_text?: string }> | null;

    if (questions?.length && !isFallbackQuestion(questions[0])) {
      const normalized = normalizeQuestions(questions as Array<Record<string, unknown>>);

      // If normalization changed anything, write the clean version back to cache
      // so future requests don't need to repair and the DB stays clean.
      const wasRepaired = JSON.stringify(normalized) !== JSON.stringify(questions);
      if (wasRepaired) {
        log.warn("malformed options detected in cache — rewriting with repaired data", {
          exam_id: examId,
        });
        supabase
          .from("cached_questions")
          .update({ questions: normalized })
          .eq("exam_id", examId)
          .then(({ error }) => {
            if (error) log.error("cache repair write failed", { exam_id: examId, error: error.message });
            else log.info("cache repaired and updated", { exam_id: examId });
          });
      }

      cacheTimer.done("cache hit", {
        exam_id: examId,
        question_count: normalized.length,
        repaired: wasRepaired,
      });
      reqTimer.done("request complete", { exam_id: examId, source: "cache" });
      return NextResponse.json({ questions: normalized, source: "cache" });
    }

    if (questions?.length) {
      log.warn("dummy/fallback questions in cache — purging and regenerating", {
        exam_id: examId,
        sample: questions[0]?.question_text?.slice(0, 60),
      });
      const { error: delErr } = await supabase
        .from("cached_questions")
        .delete()
        .eq("exam_id", examId);
      if (delErr) {
        log.error("failed to purge dummy cache", { exam_id: examId, error: delErr.message });
      } else {
        log.info("dummy cache purged", { exam_id: examId });
      }
    } else {
      cacheTimer.done("cache miss", { exam_id: examId });
    }
  } else {
    log.info("forced refresh — skipping cache", { exam_id: examId });
  }

  // 2 — Resolve exam name: static map → exams catalog → slug fallback
  let examName = EXAM_NAMES[examId];
  if (!examName) {
    const { data: catalogEntry } = await supabase
      .from("exams")
      .select("name")
      .eq("id", examId)
      .maybeSingle();
    examName = catalogEntry?.name ?? examId.replace(/-/g, " ").toUpperCase();
  }

  // 3 — Generate with Gemini
  log.info("calling Gemini", { exam_id: examId, exam_name: examName, question_count: 20 });
  const geminiTimer = log.timer();

  let questions;
  try {
    questions = await generateMockQuestions(examName, 20);
    geminiTimer.done("Gemini responded", {
      exam_id: examId,
      question_count: questions.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    geminiTimer.done("Gemini failed", { exam_id: examId, error: msg });
    log.error("AI generation error", { exam_id: examId, exam_name: examName, error: msg });
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
      if (error) {
        log.error("cache upsert failed", { exam_id: examId, error: error.message });
      } else {
        log.info("questions cached", { exam_id: examId, ttl_days: 7 });
      }
    });

  const normalized = normalizeQuestions(questions as Array<Record<string, unknown>>);
  reqTimer.done("request complete", { exam_id: examId, source: "gemini" });
  return NextResponse.json({ questions: normalized, source: "gemini" });
}
