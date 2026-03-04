// Question types for the lifestyle questionnaire
export type QuestionType = 'single' | 'slider' | 'number' | 'date';

export interface QuestionOption {
  label: string;
  value: string;
  // Points adjustment to life expectancy (in years)
  impact: number;
}

export interface Question {
  id: string;
  text: string;
  subtitle?: string;
  type: QuestionType;
  options?: QuestionOption[];
  // For slider/number inputs
  min?: number;
  max?: number;
  unit?: string;
  // Micro-reward message shown after answering
  microReward?: string;
  // Category grouping
  category: QuestionCategory;
}

export type QuestionCategory =
  | 'demographics'
  | 'lifestyle'
  | 'diet'
  | 'exercise'
  | 'sleep'
  | 'mental_health'
  | 'medical'
  | 'social'
  | 'habits';

export interface UserResponse {
  questionId: string;
  answer: string;
  impact: number;
}

export interface PredictionResult {
  userId: string;
  predictedLifespan: number;
  deathDate: string;
  daysRemaining: number;
  longevityScore: number;
  insights: LongevityInsight[];
}

export interface LongevityInsight {
  category: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  yearsImpact: number;
}

export interface BloodTestData {
  hdl?: number;
  ldl?: number;
  cholesterol?: number;
  glucose?: number;
}

// Navigation types
export type RootStackParamList = {
  Landing: undefined;
  Questionnaire: undefined;
  Calculation: { responses: UserResponse[] };
  Reveal: { prediction: PredictionResult };
  Dashboard: { prediction: PredictionResult };
  Share: { prediction: PredictionResult };
  BloodTest: { userId: string };
};
