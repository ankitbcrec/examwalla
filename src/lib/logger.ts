/**
 * Structured backend logger for ExamWalla API routes.
 *
 * Outputs JSON lines to stdout/stderr — Vercel, Railway, Datadog,
 * and every other log aggregator can parse these natively.
 *
 * Usage:
 *   const log = createLogger("GET /api/questions/[examId]");
 *   log.info("cache hit", { exam_id, user_id });
 *
 *   const t = log.timer();
 *   await callGemini();
 *   t.done("gemini responded", { question_count: 20 });
 */

type Level = "debug" | "info" | "warn" | "error";

type Meta = Record<string, unknown>;

function emit(level: Level, route: string, message: string, meta?: Meta) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    route,
    message,
    ...meta,
  };
  // error → stderr so monitoring tools can split by severity
  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else if (level === "warn") {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export interface Logger {
  debug: (message: string, meta?: Meta) => void;
  info:  (message: string, meta?: Meta) => void;
  warn:  (message: string, meta?: Meta) => void;
  error: (message: string, meta?: Meta) => void;
  /** Start a stopwatch. Call .done() to emit an info log with duration_ms. */
  timer: () => { done: (message: string, meta?: Meta) => void };
}

/**
 * Creates a logger scoped to one API route.
 * @param route  Human-readable label, e.g. "GET /api/questions/[examId]"
 */
export function createLogger(route: string): Logger {
  return {
    debug: (message, meta) => emit("debug", route, message, meta),
    info:  (message, meta) => emit("info",  route, message, meta),
    warn:  (message, meta) => emit("warn",  route, message, meta),
    error: (message, meta) => emit("error", route, message, meta),

    timer() {
      const start = Date.now();
      return {
        done(message, meta) {
          emit("info", route, message, { duration_ms: Date.now() - start, ...meta });
        },
      };
    },
  };
}

/** Shorten a UUID to its first 8 chars — enough to correlate logs, not enough to leak. */
export function uid(userId: string): string {
  return userId.slice(0, 8);
}
