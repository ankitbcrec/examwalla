import { NextRequest, NextResponse } from "next/server";
import { generateAIInsights } from "@/lib/gemini";
import type { TestResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const result: TestResult = await req.json();
    const insights = await generateAIInsights(result);
    return NextResponse.json({ insights });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
