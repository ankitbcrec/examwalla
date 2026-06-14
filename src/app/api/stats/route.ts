import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createLogger, uid } from "@/lib/logger";

const log = createLogger("GET /api/stats");

export async function GET() {
  const t = log.timer();
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    log.warn("unauthenticated stats request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  log.info("fetching stats", { user_id: uid(user.id) });

  const { data: attempts, error } = await supabase
    .from("test_attempts")
    .select("score, total_marks, time_taken_seconds")
    .eq("user_id", user.id)
    .eq("status", "completed");

  if (error) {
    log.error("stats query failed", { user_id: uid(user.id), error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!attempts || attempts.length === 0) {
    log.info("no completed attempts yet", { user_id: uid(user.id) });
    t.done("stats returned (empty)", { user_id: uid(user.id) });
    return NextResponse.json({
      tests_attempted: 0,
      average_score: 0,
      best_score: 0,
      total_study_time_minutes: 0,
    });
  }

  const scores = attempts.map((a) =>
    Math.round((a.score / a.total_marks) * 100)
  );
  const result = {
    tests_attempted: attempts.length,
    average_score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    best_score: Math.max(...scores),
    total_study_time_minutes: Math.round(
      attempts.reduce((s, a) => s + a.time_taken_seconds, 0) / 60
    ),
  };

  t.done("stats returned", { user_id: uid(user.id), ...result });
  return NextResponse.json(result);
}
