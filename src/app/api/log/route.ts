import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createLogger, uid } from "@/lib/logger";

// Note: we only log warn/error here — logging every insert would be recursive noise.
const log = createLogger("POST /api/log");

// POST /api/log
// Body: { event_type: string, exam_id?: string, payload?: object }
// Inserts one event_log row. The PK (user_id, occurred_at, exam_id) is
// set server-side so the client cannot spoof the user or forge timestamps.
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    log.warn("unauthenticated event log attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { event_type?: string; exam_id?: string; payload?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    log.warn("invalid JSON body", { user_id: uid(user.id) });
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = body.event_type?.trim();
  if (!eventType) {
    log.warn("missing event_type", { user_id: uid(user.id) });
    return NextResponse.json({ error: "event_type is required" }, { status: 400 });
  }

  const examId = body.exam_id?.trim() || "global";

  // occurred_at defaults to clock_timestamp() in Postgres (microsecond precision).
  // We omit it here so the DB clock is authoritative.
  const { data, error } = await supabase
    .from("event_logs")
    .insert({
      user_id: user.id,
      exam_id: examId,
      event_type: eventType,
      payload: body.payload ?? {},
    })
    .select("log_key, occurred_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      // Unique violation: two events at the exact same microsecond — extremely rare.
      // Return 200 so the client doesn't retry and spam the DB.
      log.warn("PK collision on event_logs insert (same microsecond) — skipped", {
        user_id: uid(user.id),
        event_type: eventType,
        exam_id: examId,
        pg_code: error.code,
      });
      return NextResponse.json({ ok: true, skipped: true });
    }
    log.error("event_logs insert failed", {
      user_id: uid(user.id),
      event_type: eventType,
      exam_id: examId,
      error: error.message,
      pg_code: error.code,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, log_key: data.log_key, occurred_at: data.occurred_at });
}

// GET /api/log
// Query params (all optional):
//   exam_id       — filter to one exam
//   event_type    — filter to one event type
//   from          — ISO timestamp lower bound (inclusive)
//   limit         — max rows (default 100, max 500)
//
// Returns events for the authenticated user ordered by occurred_at DESC.
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const examId    = searchParams.get("exam_id");
  const eventType = searchParams.get("event_type");
  const from      = searchParams.get("from");
  const limit     = Math.min(parseInt(searchParams.get("limit") ?? "100", 10), 500);

  let query = supabase
    .from("event_logs")
    .select("log_key, user_id, occurred_at, exam_id, event_type, payload")
    .eq("user_id", user.id)
    .order("occurred_at", { ascending: false })
    .limit(limit);

  if (examId)    query = query.eq("exam_id", examId);
  if (eventType) query = query.eq("event_type", eventType);
  if (from)      query = query.gte("occurred_at", from);

  const { data, error } = await query;

  if (error) {
    log.error("event_logs query failed", {
      user_id: uid(user.id),
      error: error.message,
      pg_code: error.code,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data, count: data.length });
}
