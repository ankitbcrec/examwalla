import { GoogleGenerativeAI } from "@google/generative-ai";
import { TestResult } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateAIInsights(result: TestResult): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

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

Keep it concise, friendly, and student-focused. Use simple language. Format with clear sections.
    `.trim();

    const result_ai = await model.generateContent(prompt);
    const response = await result_ai.response;
    return response.text();
  } catch {
    return `Great effort on completing the exam! You scored ${result.accuracy}% accuracy.

**Strengths:** You showed persistence by completing the full exam. Your correct answers demonstrate solid foundational knowledge.

**Areas to Improve:** Focus on the sections where you had more incorrect answers. Review the explanations for questions you missed.

**Study Tips:**
- Review incorrect answers with explanations
- Practice time management — aim for consistent pacing
- Focus extra study time on your weaker sections

Keep up the practice and you'll see significant improvement! Every attempt makes you stronger. 💪`;
  }
}

export async function generateMockQuestions(
  examName: string,
  totalQuestions: number = 10
): Promise<
  Array<{
    question_text: string;
    options: { key: string; text: string }[];
    correct_answer: string;
    explanation: string;
    section: string;
  }>
> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
Generate ${totalQuestions} multiple-choice questions for a "${examName}" mock exam.

Return ONLY a valid JSON array with this exact structure (no markdown, no extra text):
[
  {
    "question_text": "Question text here?",
    "options": [
      {"key": "A", "text": "Option A text"},
      {"key": "B", "text": "Option B text"},
      {"key": "C", "text": "Option C text"},
      {"key": "D", "text": "Option D text"}
    ],
    "correct_answer": "A",
    "explanation": "Brief explanation of why A is correct",
    "section": "Topic/Section Name"
  }
]

Make questions realistic, educational, and varied in difficulty. Cover different sections/topics of the exam.
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    return JSON.parse(jsonStr);
  } catch {
    return generateFallbackQuestions(examName, totalQuestions);
  }
}

function generateFallbackQuestions(examName: string, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    question_text: `Sample question ${i + 1} for ${examName}: Which of the following is correct?`,
    options: [
      { key: "A", text: "First option" },
      { key: "B", text: "Second option" },
      { key: "C", text: "Third option" },
      { key: "D", text: "Fourth option" },
    ],
    correct_answer: "A",
    explanation: "This is the correct answer because it best represents the concept.",
    section: "General",
  }));
}
