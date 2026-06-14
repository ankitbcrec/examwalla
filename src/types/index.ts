export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Exam {
  id: string;
  name: string;
  description: string;
  category: string;
  total_questions: number;
  duration_minutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  negative_marking: boolean;
  negative_marks?: number;
  icon: string;
  tags: string[];
}

export interface Question {
  id: string;
  exam_id: string;
  question_number: number;
  question_text: string;
  options: { key: string; text: string }[];
  correct_answer: string;
  explanation?: string;
  section?: string;
  marks: number;
}

export type QuestionStatus =
  | "not_visited"
  | "answered"
  | "not_answered"
  | "marked_for_review"
  | "answered_and_marked";

export interface TestAttempt {
  id: string;
  user_id: string;
  exam_id: string;
  exam_name: string;
  started_at: string;
  submitted_at?: string;
  answers: Record<number, string>;
  question_statuses: Record<number, QuestionStatus>;
  time_taken_seconds?: number;
  score?: number;
  total_marks?: number;
  accuracy?: number;
  percentile?: number;
  status: "in_progress" | "completed" | "abandoned";
}

export interface TestResult {
  attempt_id: string;
  exam_name: string;
  score: number;
  total_marks: number;
  accuracy: number;
  percentile: number;
  time_taken_seconds: number;
  correct_answers: number;
  wrong_answers: number;
  skipped_answers: number;
  section_scores: SectionScore[];
  ai_insights?: string;
}

export interface SectionScore {
  section: string;
  correct: number;
  wrong: number;
  total: number;
  score: number;
  max_score: number;
}

export interface DashboardStats {
  tests_attempted: number;
  average_score: number;
  best_score: number;
  total_study_time_minutes: number;
}

export interface RecentTest {
  id: string;
  exam_name: string;
  score: number;
  total_marks: number;
  accuracy: number;
  time_taken_seconds: number;
  status: "completed" | "in_progress" | "abandoned";
  submitted_at: string;
}
