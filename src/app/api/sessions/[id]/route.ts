import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createLogger, uid } from "@/lib/logger";

// PATCH /api/sessions/[id] — called when user SUBMITS a test
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const log = createLogger("PATCH /api/sessions/[id]");
  const t = log.timer();

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    log.warn("unauthenticated session complete attempt", { session_id: id });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  log.info("completing session", {
    user_id: uid(user.id),
    session_id: id,
    score: body.score,
    total_marks: body.total_marks,
    correct: body.correct,
    wrong: body.wrong,
    skipped: body.skipped,
    accuracy: body.accuracy,
    time_taken_s: body.time_taken,
  });

  const { data, error } = await supabase
    .from("test_attempts")
    .update({
      answers: body.answers,
      section_scores: body.section_scores,
      score: body.score,
      total_marks: body.total_marks,
      correct_answers: body.correct,
      wrong_answers: body.wrong,
      skipped_answers: body.skipped,
      accuracy: body.accuracy,
      percentile: body.percentile ?? Math.floor(40 + Math.random() * 50),
      time_taken_seconds: body.time_taken,
      status: "completed",
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error) {
    log.error("session update failed", {
      user_id: uid(user.id),
      session_id: id,
      error: error.message,
      code: error.code,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  t.done("session completed", { user_id: uid(user.id), session_id: data.id });
  return NextResponse.json({ id: data.id });
}

// GET /api/sessions/[id] — fetch a single session (includes questions for review)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const log = createLogger("GET /api/sessions/[id]");
  const t = log.timer();

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    log.warn("unauthenticated session fetch", { session_id: id });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  log.info("fetching session", { user_id: uid(user.id), session_id: id });

  const { data, error } = await supabase
    .from("test_attempts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    log.warn("session not found", {
      user_id: uid(user.id),
      session_id: id,
      error: error?.message,
    });
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  t.done("session fetched", { user_id: uid(user.id), session_id: id, exam_id: data.exam_id });
  return NextResponse.json(data);
}
