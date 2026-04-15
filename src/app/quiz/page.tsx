"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import QuizProgress from "@/components/QuizProgress";
import QuizQuestion from "@/components/QuizQuestion";
import { getClientQuestions } from "@/data/questions";
import { ClientQuestion, QuizResultResponse } from "@/types/quiz";

const clientQuestions: ClientQuestion[] = getClientQuestions();

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = clientQuestions[currentIndex];
  const totalQuestions = clientQuestions.length;
  const allAnswered = Object.keys(answers).length === totalQuestions;

  const handleSelect = (choiceIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: choiceIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) throw new Error("送信に失敗しました");

      const result: QuizResultResponse = await res.json();
      sessionStorage.setItem("quizResult", JSON.stringify(result));
      sessionStorage.setItem("quizAnswers", JSON.stringify(answers));
      router.push("/quiz/result");
    } catch {
      alert("エラーが発生しました。もう一度お試しください。");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col px-4 py-8">
        <div className="mx-auto w-full max-w-2xl">
          <QuizProgress current={currentIndex + 1} total={totalQuestions} />

          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            selectedAnswer={answers[currentQuestion.id]}
            onSelect={handleSelect}
          />

          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              前の問題
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion.id] === undefined}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                次の問題
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className="rounded-lg bg-green-600 px-5 py-2.5 text-white transition hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "採点中..." : "回答を送信する"}
              </button>
            )}
          </div>

          {/* Question navigation dots */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {clientQuestions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(index)}
                className={`h-8 w-8 rounded-full text-sm font-medium transition cursor-pointer ${
                  index === currentIndex
                    ? "bg-blue-600 text-white"
                    : answers[q.id] !== undefined
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
