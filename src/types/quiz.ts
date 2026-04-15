export interface Question {
  id: number;
  question: string;
  choices: string[];
  correctAnswerIndex: number;
}

export interface ClientQuestion {
  id: number;
  question: string;
  choices: string[];
}

export interface QuizSubmission {
  answers: Record<number, number>;
}

export interface QuizResultDetail {
  questionId: number;
  correct: boolean;
  correctAnswerIndex: number;
  selectedAnswerIndex: number;
}

export interface QuizResultResponse {
  score: number;
  total: number;
  isPerfect: boolean;
  details: QuizResultDetail[];
}
