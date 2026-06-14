import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

// PATCH /api/sessions/[id] — called when user SUBMITS a test
// Updates the existing session with answers, score, and all result data
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

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
    console.error("Complete session error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

// GET /api/sessions/[id] — fetch a single session (includes questions for review)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
