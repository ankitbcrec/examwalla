import { GoogleGenerativeAI } from "@google/generative-ai";
import { TestResult } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Use stable model — gemini-2.0-flash-exp was deprecated
const MODEL = "gemini-2.0-flash";

export async function generateAIInsights(result: TestResult): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const prompt = `
You are a friendly and encouraging AI tutor for a student who just completed a mock exam.

Exam: ${result.exam_name}
Score: ${result.score}/${result.total_marks} (${result.accuracy}% accuracy)
Percentile: ${result.percentile}th percentile
Correct Answers: ${result.correct_answers}
Wrong Answers: ${result.wrong_answers}
Skipped: ${result.skipped_answers}
Time Taken: ${Math.floor(result.time_taken_seconds / 60)} minutes

Section-wise Performance:
${result.section_scores.map((s) => `- ${s.section}: ${s.correct}/${s.total} correct (${Math.round((s.correct / s.total) * 100)}%)`).join("\n")}

Please provide:
1. A warm, encouraging opening (1-2 sentences)
2. Key strengths observed (2-3 bullet points)
3. Areas that need improvement (2-3 bullet points)
4. Specific, actionable study tips (2-3 bullet points)
5. A motivating closing statement

Keep it concise, friendly, and student-focused. Use simple language. Format with clear sections using **bold** headers.
    `.trim();

    const result_ai = await model.generateContent(prompt);
    const response = await result_ai.response;
    return response.text();
  } catch (err) {
    console.error("[Gemini] generateAIInsights failed:", err);
    return `Great effort on completing the exam! You scored ${result.accuracy}% accuracy.

**Strengths:** You showed persistence by completing the full exam. Your correct answers demonstrate solid foundational knowledge.

**Areas to Improve:** Focus on the sections where you had more incorrect answers. Review the explanations for questions you missed.

**Study Tips:**
• Review incorrect answers with explanations
• Practice time management — aim for consistent pacing
• Focus extra study time on your weaker sections

Keep up the practice and you'll see significant improvement! Every attempt makes you stronger.`;
  }
}

// Throws on failure — callers decide whether to use fallback
export async function generateMockQuestions(
  examName: string,
  totalQuestions: number = 30
): Promise<
  Array<{
    question_text: string;
    options: { key: string; text: string }[];
    correct_answer: string;
    explanation: string;
    section: string;
  }>
> {
  const model = genAI.getGenerativeModel({ model: MODEL });

  const prompt = `
Generate ${totalQuestions} multiple-choice questions for a "${examName}" mock exam.

Return ONLY a valid JSON array — no markdown fences, no extra text before or after:
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
- Questions must be realistic and specific to ${examName}
- Cover at least 3 different sections/topics
- Mix easy, medium, and hard difficulty
- correct_answer must be exactly one of: "A", "B", "C", "D"
  `.trim();

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip any markdown code fences Gemini might add despite instructions
  const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const jsonStart = clean.indexOf("[");
  const jsonEnd = clean.lastIndexOf("]") + 1;

  if (jsonStart === -1 || jsonEnd === 0) {
    throw new Error(`Gemini returned non-JSON response: ${clean.slice(0, 200)}`);
  }

  const parsed = JSON.parse(clean.slice(jsonStart, jsonEnd));

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Gemini returned empty question array");
  }

  return parsed;
}
