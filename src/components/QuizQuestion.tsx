import { ClientQuestion } from "@/types/quiz";

interface QuizQuestionProps {
  question: ClientQuestion;
  questionNumber: number;
  selectedAnswer: number | undefined;
  onSelect: (choiceIndex: number) => void;
}

export default function QuizQuestion({
  question,
  questionNumber,
  selectedAnswer,
  onSelect,
}: QuizQuestionProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        <span className="mr-2 text-blue-600">Q{questionNumber}.</span>
        {question.question}
      </h2>
      <div className="space-y-3">
        {question.choices.map((choice, index) => (
          <label
            key={index}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition ${
              selectedAnswer === index
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={selectedAnswer === index}
              onChange={() => onSelect(index)}
              className="mt-0.5 h-4 w-4 text-blue-600"
            />
            <span className="text-gray-700">{choice}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
