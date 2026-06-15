/**
 * ExamWalla Search Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * All search behaviour is controlled here. Override any value by setting the
 * corresponding environment variable in .env.local or your deployment settings
 * (Vercel → Project Settings → Environment Variables). No code redeploy needed.
 *
 * Client-exposed values use NEXT_PUBLIC_ prefix (available in browser).
 * Server-only values are plain (never sent to the browser).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const SEARCH_CONFIG = {
  // ── Infinite AI Search ───────────────────────────────────────────────────
  /** Master switch. Set NEXT_PUBLIC_AI_SEARCH_ENABLED=false to disable AI entirely. */
  AI_ENABLED: process.env.NEXT_PUBLIC_AI_SEARCH_ENABLED !== "false",

  /**
   * When the static + DB catalog returns fewer results than this, the AI
   * fallback fires. Raise it to trigger AI more often; set to 0 to disable
   * the threshold (AI always runs when enabled).
   * Default: 4
   */
  AI_THRESHOLD: Number(process.env.NEXT_PUBLIC_AI_SEARCH_THRESHOLD ?? 4),

  /** Minimum query length (chars) before AI is considered. Default: 3 */
  AI_MIN_CHARS: Number(process.env.NEXT_PUBLIC_AI_SEARCH_MIN_CHARS ?? 3),

  /**
   * Milliseconds of typing pause before AI fires.
   * Lower = more responsive but more API calls. Default: 600ms
   */
  AI_DEBOUNCE_MS: Number(process.env.NEXT_PUBLIC_AI_DEBOUNCE_MS ?? 600),

  // ── AI Output ────────────────────────────────────────────────────────────
  /** How many exam suggestions Gemini should return per query. Default: 5 */
  AI_SUGGESTION_COUNT: Number(process.env.NEXT_PUBLIC_AI_SUGGESTION_COUNT ?? 5),

  // ── Cache ────────────────────────────────────────────────────────────────
  /** How many days to cache search suggestions in the DB. Default: 30 */
  SUGGESTION_CACHE_TTL_DAYS: Number(process.env.NEXT_PUBLIC_SUGGESTION_CACHE_TTL_DAYS ?? 30),
} as const;
