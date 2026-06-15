import type { TestResult } from "@/types";

// gemini-2.0-flash: no thinking mode, ~5-15s for 20 questions, cheaper than 2.5
// gemini-2.5-flash was triggering 90s+ of internal "thinking" that can't be disabled
// via the v1beta API, causing aborts and massive token waste.
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Low-level Gemini call.
 * @param jsonMode       Sets response_mime_type:"application/json" — valid JSON guaranteed.
 * @param responseSchema OpenAPI-style schema passed to Gemini for structural enforcement.
 *                       Requires jsonMode:true. Prevents field-name hallucination.
 */
export async function callGemini(
  prompt: string,
  temperature = 0.7,
  jsonMode = false,
  responseSchema?: object
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set in environment");

  // 90-second hard timeout — Gemini should never take longer than this
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90_000);

  let res: Response;
  try {
    res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: 32768,
          ...(jsonMode && { response_mime_type: "application/json" }),
          ...(responseSchema && { response_schema: responseSchema }),
        },
      }),
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Gemini HTTP ${res.status}: ${err?.error?.message ?? res.statusText}`
    );
  }

  const data = await res.json();

  // Gemini 2.5 may return multiple parts: one for thinking tokens, one for the answer.
  // Prefer a part explicitly NOT flagged as thought; fall back to the last part.
  type Part = { thought?: boolean; text?: string };
  const parts: Part[] = data?.candidates?.[0]?.content?.parts ?? [];
  const text = (parts.find((p) => !p.thought) ?? parts[parts.length - 1])?.text;

  if (!text) throw new Error("Gemini returned empty response");
  return text.trim();
}

/**
 * Robust JSON array extractor.
 *
 * Handles three failure modes from Gemini 2.5:
 *  1. Thinking tokens prepended before the JSON array (finds '[' and extracts from there)
 *  2. Truncated array (recovers every complete object before the cut-off)
 *  3. Clean output (fast path: JSON.parse succeeds immediately)
 */
export function extractJsonArray(raw: string): unknown[] {
  // Fast path: clean JSON with no preamble
  try { return JSON.parse(raw); } catch { /* fall through */ }

  // Locate the opening bracket of the JSON array (skips any thinking preamble)
  const start = raw.indexOf("[");
  if (start === -1) throw new Error("No JSON array found in Gemini response");

  // Walk forward to find the matching close bracket
  let depth = 0;
  for (let i = start; i < raw.length; i++) {
    if (raw[i] === "[") depth++;
    else if (raw[i] === "]" && --depth === 0) {
      return JSON.parse(raw.slice(start, i + 1));
    }
  }

  // Array was truncated mid-stream — recover whatever complete objects we have
  const slice = raw.slice(start);

  // Try: last complete object followed by a comma (i.e. more items were expected)
  const lastComma = slice.lastIndexOf("},");
  if (lastComma > 0) {
    try { return JSON.parse(slice.slice(0, lastComma + 1) + "]"); } catch { /* fall through */ }
  }

  // Try: last closing brace (final item, no trailing comma)
  const lastBrace = slice.lastIndexOf("}");
  if (lastBrace > 0) {
    try { return JSON.parse(slice.slice(0, lastBrace + 1) + "]"); } catch { /* fall through */ }
  }

  throw new Error(`Gemini response malformed and unrecoverable (length: ${raw.length})`);
}

// Structural schema for question generation.
// Gemini uses UPPERCASE type names. This prevents field-name hallucination
// (e.g. {"D":"text","key":"C"} instead of {"key":"C","text":"..."}).
const QUESTION_SCHEMA = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      question_text:  { type: "STRING" },
      correct_answer: { type: "STRING" },
      explanation:    { type: "STRING" },
      section:        { type: "STRING" },
      options: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            key:  { type: "STRING" },
            text: { type: "STRING" },
          },
        },
      },
    },
  },
};

export async function generateMockQuestions(
  examName: string,
  totalQuestions = 20
): Promise<
  Array<{
    question_text: string;
    options: { key: string; text: string }[];
    correct_answer: string;
    explanation: string;
    section: string;
  }>
> {
  const prompt = `Generate ${totalQuestions} multiple-choice questions for a "${examName}" mock exam.

Return a JSON array of exactly ${totalQuestions} objects with this structure:
[
  {
    "question_text": "Full question text?",
    "options": [
      {"key": "A", "text": "Option A text"},
      {"key": "B", "text": "Option B text"},
      {"key": "C", "text": "Option C text"},
      {"key": "D", "text": "Option D text"}
    ],
    "correct_answer": "A",
    "explanation": "Why A is correct",
    "section": "Topic name"
  }
]

Requirements:
- Questions must be realistic and specific to "${examName}"
- Cover at least 3 different sections/topics
- Mix easy, medium, and hard difficulty
- correct_answer must be exactly one of: "A", "B", "C", "D"
- Keep each explanation to 1-2 sentences maximum (brevity saves tokens)`;

  const text = await callGemini(prompt, 0.7, true, QUESTION_SCHEMA);

  // extractJsonArray handles thinking-token preamble and truncated output gracefully.
  // Even if Gemini cuts off mid-array, we recover all complete questions before the break.
  const parsed = extractJsonArray(text);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Gemini returned empty question array");
  }

  return parsed as Array<{
    question_text: string;
    options: { key: string; text: string }[];
    correct_answer: string;
    explanation: string;
    section: string;
  }>;
}

export async function generateAIInsights(result: TestResult): Promise<string> {
  const prompt = `You are a friendly and encouraging AI tutor for a student who just completed a mock exam.

Exam: ${result.exam_name}
Score: ${result.score}/${result.total_marks} (${result.accuracy}% accuracy)
Percentile: ${result.percentile}th percentile
Correct: ${result.correct_answers} | Wrong: ${result.wrong_answers} | Skipped: ${result.skipped_answers}
Time: ${Math.floor(result.time_taken_seconds / 60)} minutes

Section Performance:
${result.section_scores
  .map(
    (s) =>
      `- ${s.section}: ${s.correct}/${s.total} correct (${Math.round((s.correct / s.total) * 100)}%)`
  )
  .join("\n")}

Provide:
1. A warm, encouraging opening (1-2 sentences)
2. **Key Strengths:** (2-3 bullet points starting with •)
3. **Areas to Improve:** (2-3 bullet points starting with •)
4. **Study Tips:** (2-3 bullet points starting with •)
5. A motivating closing sentence

Keep it concise and student-friendly.`;

  try {
    return await callGemini(prompt); // plain text — no JSON mode
  } catch (err) {
    console.error("[Gemini] generateAIInsights failed:", err);
    return `Great effort on completing the exam! You scored ${result.accuracy}% accuracy.

**Key Strengths:**
• You completed the full exam — that takes real discipline
• Your correct answers show solid foundational knowledge

**Areas to Improve:**
• Review sections where you had incorrect answers
• Focus extra study time on weaker topics

**Study Tips:**
• Review wrong answers with explanations after every test
• Practice one full mock test per week to build stamina
• Use spaced repetition for topics you consistently miss

Keep practicing and you'll see significant improvement!`;
  }
}
