import { QuizResultResponse } from "@/types/quiz";
import { ClientQuestion } from "@/types/quiz";

interface ResultCardProps {
  result: QuizResultResponse;
  questions: ClientQuestion[];
}

export default function ResultCard({ result, questions }: ResultCardProps) {
  return (
    <div className="space-y-6">
      {/* Score card */}
      <div
        className={`rounded-lg p-8 text-center shadow-md ${
          result.isPerfect ? "bg-green-50" : "bg-white"
        }`}
      >
        <div
          className={`mb-2 text-5xl font-bold ${
            result.isPerfect ? "text-green-600" : "text-red-600"
          }`}
        >
          {result.score} / {result.total}
        </div>
        <p className="text-lg text-gray-600">
          {result.isPerfect
            ? "全問正解です！おめでとうございます！"
            : "不合格です。全問正解を目指して再挑戦してください。"}
        </p>
      </div>

      {/* Per-question results */}
      <div className="space-y-3">
        {result.details.map((detail) => {
          const question = questions.find((q) => q.id === detail.questionId);
          if (!question) return null;

          return (
            <div
              key={detail.questionId}
              className={`rounded-lg border-2 p-4 ${
                detail.correct
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="mb-2 flex items-start gap-2">
                <span
                  className={`mt-0.5 text-lg ${
                    detail.correct ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {detail.correct ? "○" : "✕"}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    Q{detail.questionId}. {question.question}
                  </p>
                  {!detail.correct && (
                    <div className="mt-2 text-sm">
                      <p className="text-red-600">
                        あなたの回答: {question.choices[detail.selectedAnswerIndex]}
                      </p>
                      <p className="text-green-700 font-medium">
                        正解: {question.choices[detail.correctAnswerIndex]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
