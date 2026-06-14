import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// POST /api/results — save a completed test attempt
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { data, error } = await supabase
    .from("test_attempts")
    .insert({
      user_id: user.id,
      exam_id: body.exam_id,
      exam_name: body.exam_name,
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
    console.error("Insert result error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

// GET /api/results?id=uuid — fetch a single attempt
// GET /api/results — fetch recent 10 attempts
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");

  if (id) {
    const { data, error } = await supabase
      .from("test_attempts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  }

  const { data } = await supabase
    .from("test_attempts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json(data ?? []);
}
