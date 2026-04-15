import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { questions } from "@/data/questions";
import { recordPerfectScore } from "@/lib/google-sheets";
import { QuizSubmission } from "@/types/quiz";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  // Re-validate answers to prevent direct API calls
  const body: QuizSubmission = await request.json();
  const { answers } = body;

  if (!answers || typeof answers !== "object") {
    return NextResponse.json(
      { error: "回答データが不正です" },
      { status: 400 }
    );
  }

  const score = questions.filter(
    (q) => answers[q.id] === q.correctAnswerIndex
  ).length;

  if (score !== questions.length) {
    return NextResponse.json(
      { error: "全問正解ではありません" },
      { status: 400 }
    );
  }

  try {
    await recordPerfectScore(
      session.user.email,
      session.user.name ?? "不明",
      questions.length
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Google Sheets recording error:", error);
    return NextResponse.json(
      { error: "記録に失敗しました" },
      { status: 500 }
    );
  }
}
