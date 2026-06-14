import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { callGemini } from "@/lib/gemini";
import { createLogger } from "@/lib/logger";

const log = createLogger("GET /api/search-suggest");

export interface ExamSuggestion {
  id: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
}

/** Normalize a raw query into a stable cache key */
function normalizeQuery(raw: string): string {
  return raw.toLowerCase().trim().replace(/\s+/g, " ");
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("q") ?? "";
  const query = normalizeQuery(raw);

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [], source: "empty" });
  }

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 1. Cache lookup ──────────────────────────────────────────
  const cacheTimer = log.timer();
  const { data: cached } = await supabase
    .from("search_suggestions")
    .select("suggestions, hit_count")
    .eq("query", query)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (cached) {
    cacheTimer.done("cache hit", { query, hit_count: cached.hit_count + 1 });

    // Increment hit counter fire-and-forget
    supabase
      .from("search_suggestions")
      .update({ hit_count: cached.hit_count + 1 })
      .eq("query", query)
      .then(({ error }) => {
        if (error) log.warn("hit_count update failed", { query, error: error.message });
      });

    return NextResponse.json({
      suggestions: cached.suggestions as ExamSuggestion[],
      source: "cache",
    });
  }

  cacheTimer.done("cache miss", { query });

  // ── 2. Call Gemini ───────────────────────────────────────────
  const t = log.timer();
  log.info("calling Gemini for suggestions", { query });

  const prompt = `A student typed this into an exam practice search: "${query}"

Suggest exactly 5 specific exams they might want to practice for.
Return ONLY a JSON array, no other text:
[{"id":"kebab-case-slug","name":"Full Exam Name","description":"One line: what it is and who takes it","category":"Government|Banking|Engineering|Medical|MBA|Language|Finance|Tech","emoji":"one emoji"}]

Rules:
- id must be lowercase kebab-case, max 30 chars, unique across all 5
- Suggest real, specific exams where they exist
- Vary categories across the 5 suggestions when possible`;

  let suggestions: ExamSuggestion[];
  try {
    const text = await callGemini(prompt, 0.3);
    const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const start = clean.indexOf("[");
    const end = clean.lastIndexOf("]") + 1;
    if (start === -1 || end === 0) throw new Error("No JSON array in Gemini response");
    suggestions = JSON.parse(clean.slice(start, end));
    t.done("Gemini responded", { query, count: suggestions.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error("Gemini suggest failed", { query, error: msg });
    return NextResponse.json({ suggestions: [], source: "error" });
  }

  // ── 3. Write to cache (fire-and-forget) ─────────────────────
  supabase
    .from("search_suggestions")
    .upsert(
      {
        query,
        suggestions,
        hit_count: 1,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "query" }
    )
    .then(({ error }) => {
      if (error) {
        log.warn("suggestion cache write failed", { query, error: error.message });
      } else {
        log.info("suggestions cached", { query, ttl_days: 30 });
      }
    });

  return NextResponse.json({ suggestions, source: "gemini" });
}
