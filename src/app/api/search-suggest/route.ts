import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { callGemini } from "@/lib/gemini";
import { createLogger } from "@/lib/logger";
import { SEARCH_CONFIG } from "@/config/search";

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

/** Escape ILIKE special characters so user input isn't treated as pattern wildcards */
function escapeLike(s: string): string {
  return s.replace(/[%_\\]/g, (c) => `\\${c}`);
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

  const SUGGESTION_COUNT = SEARCH_CONFIG.AI_SUGGESTION_COUNT;
  const CACHE_TTL_MS = SEARCH_CONFIG.SUGGESTION_CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;

  // ── 1. Exact-query cache lookup ───────────────────────────────────────────
  const cacheTimer = log.timer();
  const { data: cached } = await supabase
    .from("search_suggestions")
    .select("suggestions, hit_count")
    .eq("query", query)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (cached) {
    cacheTimer.done("cache hit", { query, hit_count: cached.hit_count + 1 });

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

  // ── 2. Exams catalog lookup (DB) ──────────────────────────────────────────
  // Checks exams table first so AI-discovered exams from prior searches are
  // found instantly for similar keywords, without calling Gemini again.
  const dbTimer = log.timer();
  const safeQ = escapeLike(query);
  const { data: dbExams, error: dbErr } = await supabase
    .from("exams")
    .select("id, name, description, category, emoji")
    .ilike("name", `%${safeQ}%`)
    .limit(SUGGESTION_COUNT);

  if (dbErr) {
    log.warn("exams DB search error", { query, error: dbErr.message });
  }

  if (dbExams && dbExams.length > 0) {
    dbTimer.done("DB hit", { query, count: dbExams.length });

    const suggestions = dbExams.map((e) => ({
      id: e.id,
      name: e.name,
      description: e.description ?? "",
      category: e.category ?? "Other",
      emoji: e.emoji ?? "📝",
    })) as ExamSuggestion[];

    // Cache this query's results so next exact-match lookup skips the DB too
    supabase
      .from("search_suggestions")
      .upsert(
        {
          query,
          suggestions,
          hit_count: 1,
          expires_at: new Date(Date.now() + CACHE_TTL_MS).toISOString(),
        },
        { onConflict: "query" }
      )
      .then(({ error }) => {
        if (error) log.warn("suggestion cache write (DB results) failed", { query, error: error.message });
        else log.info("suggestions cached from DB results", { query, count: suggestions.length });
      });

    return NextResponse.json({ suggestions, source: "db" });
  }
  dbTimer.done("DB miss", { query });

  // ── 3. Gemini AI fallback ─────────────────────────────────────────────────
  if (!SEARCH_CONFIG.AI_ENABLED) {
    log.info("AI search disabled via config", { query });
    return NextResponse.json({ suggestions: [], source: "disabled" });
  }

  const t = log.timer();
  log.info("calling Gemini for suggestions", { query });

  const prompt = `A student typed this into an exam practice search: "${query}"

Suggest exactly ${SUGGESTION_COUNT} specific exams they might want to practice for.
Return ONLY a JSON array, no other text:
[{"id":"kebab-case-slug","name":"Full Exam Name","description":"One line: what it is and who takes it","category":"Government|Banking|Engineering|Medical|MBA|Language|Finance|Tech","emoji":"one emoji"}]

Rules:
- id must be lowercase kebab-case, max 30 chars, unique across all ${SUGGESTION_COUNT}
- Suggest real, specific exams where they exist
- Vary categories across the ${SUGGESTION_COUNT} suggestions when possible`;

  let suggestions: ExamSuggestion[];
  try {
    const text = await callGemini(prompt, 0.3, true);
    suggestions = JSON.parse(text);
    t.done("Gemini responded", { query, count: suggestions.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error("Gemini suggest failed", { query, error: msg });
    return NextResponse.json({ suggestions: [], source: "error" });
  }

  // ── 4. Persist: search_suggestions cache ─────────────────────────────────
  supabase
    .from("search_suggestions")
    .upsert(
      {
        query,
        suggestions,
        hit_count: 1,
        expires_at: new Date(Date.now() + CACHE_TTL_MS).toISOString(),
      },
      { onConflict: "query" }
    )
    .then(({ error }) => {
      if (error) log.warn("suggestion cache write failed", { query, error: error.message });
      else log.info("suggestions cached", { query, ttl_days: SEARCH_CONFIG.SUGGESTION_CACHE_TTL_DAYS });
    });

  // ── 5. Persist: exams catalog (grows the DB for future similar searches) ──
  supabase
    .from("exams")
    .upsert(
      suggestions.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        category: s.category,
        emoji: s.emoji,
        source: "ai",
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "id", ignoreDuplicates: false }
    )
    .then(({ error }) => {
      if (error) log.warn("exams catalog upsert failed", { query, error: error.message });
      else log.info("exams catalog updated", { query, count: suggestions.length });
    });

  return NextResponse.json({ suggestions, source: "gemini" });
}
