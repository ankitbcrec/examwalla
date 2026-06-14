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

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const t = log.timer();
  log.info("AI search suggest", { query });

  const prompt = `A student typed this into an exam practice search: "${query}"

Suggest exactly 5 specific exams they might want to practice for.
Return ONLY a JSON array, no other text:
[{"id":"kebab-case-slug","name":"Full Exam Name","description":"One line: what it is and who takes it","category":"Government|Banking|Engineering|Medical|MBA|Language|Finance|Tech","emoji":"one emoji"}]

Rules:
- id must be lowercase kebab-case, max 30 chars, unique across all 5
- Suggest real, specific exams where they exist
- Vary categories across the 5 suggestions when possible`;

  try {
    const text = await callGemini(prompt, 0.3);

    const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const start = clean.indexOf("[");
    const end = clean.lastIndexOf("]") + 1;
    if (start === -1 || end === 0) throw new Error("No JSON array in Gemini response");

    const suggestions: ExamSuggestion[] = JSON.parse(clean.slice(start, end));
    t.done("suggestions ready", { query, count: suggestions.length });

    return NextResponse.json({ suggestions });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error("suggest failed", { query, error: msg });
    return NextResponse.json({ suggestions: [] });
  }
}
