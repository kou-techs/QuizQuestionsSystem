"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ResultCard from "@/components/ResultCard";
import { getClientQuestions } from "@/data/questions";
import { QuizResultResponse } from "@/types/quiz";

const clientQuestions = getClientQuestions();

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResultResponse | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [recordError, setRecordError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("quizResult");
    if (!stored) {
      router.push("/quiz");
      return;
    }
    const parsed: QuizResultResponse = JSON.parse(stored);
    setResult(parsed);

    // Record perfect score to spreadsheet
    if (parsed.isPerfect) {
      const answersStr = sessionStorage.getItem("quizAnswers");
      if (answersStr) {
        setIsRecording(true);
        fetch("/api/sheets/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: JSON.parse(answersStr) }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("記録に失敗しました");
            setRecorded(true);
          })
          .catch(() => {
            setRecordError("スプレッドシートへの記録に失敗しました。管理者にお問い合わせください。");
          })
          .finally(() => setIsRecording(false));
      }
    }
  }, [router]);

  const handleRetry = () => {
    sessionStorage.removeItem("quizResult");
    sessionStorage.removeItem("quizAnswers");
    router.push("/quiz");
  };

  if (!result) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col px-4 py-8">
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
            採点結果
          </h2>

          <ResultCard result={result} questions={clientQuestions} />

          {/* Recording status */}
          {result.isPerfect && (
            <div className="mt-6 text-center">
              {isRecording && (
                <p className="text-gray-500">
                  スプレッドシートに記録中...
                </p>
              )}
              {recorded && (
                <p className="text-green-600 font-medium">
                  合格記録をスプレッドシートに保存しました。
                </p>
              )}
              {recordError && (
                <p className="text-red-600">{recordError}</p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex justify-center gap-4">
            {!result.isPerfect && (
              <button
                onClick={handleRetry}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium transition hover:bg-blue-700 cursor-pointer"
              >
                もう一度挑戦する
              </button>
            )}
            {result.isPerfect && recorded && (
              <p className="text-lg font-medium text-green-700">
                テスト完了です。お疲れ様でした。
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
