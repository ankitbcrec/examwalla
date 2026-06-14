import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createLogger, uid } from "@/lib/logger";

// POST /api/results — fallback result save when session PATCH fails
export async function POST(req: NextRequest) {
  const log = createLogger("POST /api/results");
  const t = log.timer();

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    log.warn("unauthenticated result save attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  log.info("saving result (fallback path — no session was created on start)", {
    user_id: uid(user.id),
    exam_id: body.exam_id,
    score: body.score,
    total_marks: body.total_marks,
    accuracy: body.accuracy,
  });

  const { data, error } = await supabase
    .from("test_attempts")
    .insert({
      user_id: user.id,
      exam_id: body.exam_id,
      exam_name: body.exam_name,
      answers: body.answers ?? null,
      section_scores: body.section_scores ?? null,
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
    .select("id")
    .single();

  if (error) {
    log.error("result insert failed", {
      user_id: uid(user.id),
      exam_id: body.exam_id,
      error: error.message,
      code: error.code,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  t.done("result saved", { user_id: uid(user.id), exam_id: body.exam_id, result_id: data.id });
  return NextResponse.json({ id: data.id });
}

// GET /api/results?id=uuid — single result
// GET /api/results        — recent 10 attempts
export async function GET(req: NextRequest) {
  const log = createLogger("GET /api/results");
  const t = log.timer();

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    log.warn("unauthenticated results fetch");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");

  if (id) {
    log.info("fetching single result", { user_id: uid(user.id), result_id: id });

    const { data, error } = await supabase
      .from("test_attempts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      log.warn("result not found", { user_id: uid(user.id), result_id: id, error: error?.message });
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    t.done("result fetched", { user_id: uid(user.id), result_id: id, exam_id: data.exam_id });
    return NextResponse.json(data);
  }

  log.info("fetching recent results", { user_id: uid(user.id) });

  const { data, error } = await supabase
    .from("test_attempts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    log.error("recent results query failed", { user_id: uid(user.id), error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  t.done("recent results fetched", { user_id: uid(user.id), count: data?.length ?? 0 });
  return NextResponse.json(data ?? []);
}
