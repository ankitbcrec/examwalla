import type { TestResult } from "@/types";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function callGemini(prompt: string, temperature = 0.7): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set in environment");

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Gemini HTTP ${res.status}: ${err?.error?.message ?? res.statusText}`
    );
  }

  const data = await res.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Gemini returned empty response");
  return text.trim();
}

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
  const prompt = `
Generate ${totalQuestions} multiple-choice questions for a "${examName}" mock exam.

Return ONLY a valid JSON array — no markdown fences, no explanation, no text outside the array:
[
  {
    "question_text": "Full question text here?",
    "options": [
      {"key": "A", "text": "Option A"},
      {"key": "B", "text": "Option B"},
      {"key": "C", "text": "Option C"},
      {"key": "D", "text": "Option D"}
    ],
    "correct_answer": "A",
    "explanation": "Brief explanation of why A is correct",
    "section": "Topic or Section Name"
  }
]

Requirements:
- Questions must be realistic and specific to "${examName}"
- Cover at least 3 different sections/topics
- Mix easy, medium, and hard difficulty
- correct_answer must be exactly one of: "A", "B", "C", "D"
`.trim();

  const text = await callGemini(prompt);

  // Strip any markdown fences the model might add despite instructions
  const clean = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const jsonStart = clean.indexOf("[");
  const jsonEnd = clean.lastIndexOf("]") + 1;
  if (jsonStart === -1 || jsonEnd === 0) {
    throw new Error(`Non-JSON response from Gemini: ${clean.slice(0, 300)}`);
  }

  const parsed = JSON.parse(clean.slice(jsonStart, jsonEnd));
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Gemini returned empty question array");
  }

  return parsed;
}

export async function generateAIInsights(result: TestResult): Promise<string> {
  const prompt = `
You are a friendly and encouraging AI tutor for a student who just completed a mock exam.

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

Keep it concise and student-friendly.
`.trim();

  try {
    return await callGemini(prompt);
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
