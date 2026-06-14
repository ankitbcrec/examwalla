import { NextRequest, NextResponse } from "next/server";
import { generateAIInsights } from "@/lib/gemini";
import { createLogger } from "@/lib/logger";
import type { TestResult } from "@/types";

const log = createLogger("POST /api/generate-insights");

export async function POST(req: NextRequest) {
  const t = log.timer();
  let examId = "unknown";

  try {
    const result: TestResult = await req.json();
    examId = result.exam_name ?? "unknown";

    log.info("generating AI insights", {
      exam_id: examId,
      score: result.score,
      accuracy: result.accuracy,
    });

    const insights = await generateAIInsights(result);

    t.done("insights generated", { exam_id: examId });
    return NextResponse.json({ insights });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error("insights generation failed", { exam_id: examId, error: msg });
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
