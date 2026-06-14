// Customer event lifecycle — full funnel from acquisition to conversion.
// Stored in event_logs.event_type.
export type EventType =
  // ── Acquisition ──────────────────────────────────────────────
  | "user_signed_up"     // first ever login (also fired by DB trigger on auth.users insert)
  | "user_logged_in"     // every subsequent SIGNED_IN auth event; payload: { provider }
  | "user_logged_out"    // explicit sign-out
  // ── Activation ───────────────────────────────────────────────
  | "dashboard_viewed"   // user lands on dashboard
  | "search_performed"   // query typed in palette; payload: { query, result_count }
  | "exam_selected"      // exam chosen from palette; payload: { exam_id, exam_name }
  // ── Engagement ───────────────────────────────────────────────
  | "exam_started"       // questions loaded + session created; payload: { total_questions }
  | "question_answered"  // option selected; payload: { question_number, answer }
  | "answer_cleared"     // selection removed; payload: { question_number }
  | "question_marked"    // marked for review; payload: { question_number, has_answer }
  // ── Conversion ───────────────────────────────────────────────
  | "exam_submitted"     // user hit Final Submit; payload: { answered, total }
  | "exam_timed_out"     // timer reached 0; payload: { answered, total }
  | "exam_abandoned"     // navigated away mid-exam
  | "results_viewed";    // results page opened; payload: { score, accuracy }

/**
 * Fire-and-forget event logger.
 *
 * Sends a POST to /api/log — never blocks the caller, never throws.
 * Uses `keepalive: true` so the request survives page navigations (submit → results).
 */
export function logEvent(
  eventType: EventType,
  examId: string = "global",
  payload?: Record<string, unknown>
): void {
  fetch("/api/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_type: eventType,
      exam_id: examId,
      payload: payload ?? {},
    }),
    keepalive: true,
  }).catch(() => {
    // Silently swallow — logging must never break the exam experience
  });
}
