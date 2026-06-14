import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createLogger, uid } from "@/lib/logger";

const log = createLogger("POST /api/sessions");

export async function POST(req: NextRequest) {
  const t = log.timer();
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    log.warn("unauthenticated session create attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  log.info("creating session", {
    user_id: uid(user.id),
    exam_id: body.exam_id,
    exam_name: body.exam_name,
    question_count: body.total_questions,
  });

  const { data, error } = await supabase
    .from("test_attempts")
    .insert({
      user_id: user.id,
      exam_id: body.exam_id,
      exam_name: body.exam_name,
      questions: body.questions,
      total_marks: body.total_questions,
      status: "in_progress",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    log.error("session insert failed", {
      user_id: uid(user.id),
      exam_id: body.exam_id,
      error: error.message,
      code: error.code,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  t.done("session created", { user_id: uid(user.id), exam_id: body.exam_id, session_id: data.id });
  return NextResponse.json({ id: data.id });
}
