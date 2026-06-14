import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: attempts } = await supabase
    .from("test_attempts")
    .select("score, total_marks, time_taken_seconds")
    .eq("user_id", user.id)
    .eq("status", "completed");

  if (!attempts || attempts.length === 0) {
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

  return NextResponse.json({
    tests_attempted: attempts.length,
    average_score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    best_score: Math.max(...scores),
    total_study_time_minutes: Math.round(
      attempts.reduce((s, a) => s + a.time_taken_seconds, 0) / 60
    ),
  });
}
