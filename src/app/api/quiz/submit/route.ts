import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { questions } from "@/data/questions";
import { QuizSubmission, QuizResultResponse } from "@/types/quiz";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body: QuizSubmission = await request.json();
  const { answers } = body;

  if (!answers || typeof answers !== "object") {
    return NextResponse.json(
      { error: "回答データが不正です" },
      { status: 400 }
    );
  }

  const details = questions.map((q) => {
    const selected = answers[q.id];
    return {
      questionId: q.id,
      correct: selected === q.correctAnswerIndex,
      correctAnswerIndex: q.correctAnswerIndex,
      selectedAnswerIndex: selected ?? -1,
    };
  });

  const score = details.filter((d) => d.correct).length;

  const result: QuizResultResponse = {
    score,
    total: questions.length,
    isPerfect: score === questions.length,
    details,
  };

  return NextResponse.json(result);
}
