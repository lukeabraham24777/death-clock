import { PredictionResult, UserResponse, BloodTestData } from '../types';

// API base URL - uses Expo constants or falls back to localhost
const API_URL = 'http://localhost:3000/api';

// Helper for making API calls with error handling
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Submit questionnaire responses and get prediction
export async function submitResponses(
  responses: UserResponse[],
  birthDate: string
): Promise<PredictionResult> {
  return request<PredictionResult>('/predict', {
    method: 'POST',
    body: JSON.stringify({ responses, birthDate }),
  });
}

// Store questionnaire responses
export async function saveResponses(
  userId: string,
  responses: UserResponse[]
): Promise<void> {
  await request('/responses', {
    method: 'POST',
    body: JSON.stringify({ userId, responses }),
  });
}

// Get existing prediction for a user
export async function getPrediction(userId: string): Promise<PredictionResult> {
  return request<PredictionResult>(`/prediction/${userId}`);
}

// Submit optional blood test data
export async function submitBloodTests(
  userId: string,
  data: BloodTestData
): Promise<PredictionResult> {
  return request<PredictionResult>('/blood-tests', {
    method: 'POST',
    body: JSON.stringify({ userId, ...data }),
  });
}

// Local prediction fallback - used when backend is unavailable
// This mirrors the Python prediction service logic
export function calculateLocalPrediction(
  responses: UserResponse[],
  birthDate: string
): PredictionResult {
  const BASE_LIFE_EXPECTANCY = 78;

  // Sum all impact scores from responses
  const totalImpact = responses.reduce((sum, r) => sum + r.impact, 0);
  const predictedLifespan = Math.max(40, Math.min(110, BASE_LIFE_EXPECTANCY + totalImpact));

  // Calculate death date
  const birth = new Date(birthDate);
  const deathDate = new Date(birth);
  deathDate.setFullYear(deathDate.getFullYear() + predictedLifespan);

  // Calculate days remaining
  const now = new Date();
  const daysRemaining = Math.max(0, Math.floor(
    (deathDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  ));

  // Calculate longevity score (0-100 based on how far above/below average)
  const longevityScore = Math.max(0, Math.min(100,
    Math.round(50 + (totalImpact * 3))
  ));

  // Generate insights based on responses
  const insights = generateInsights(responses);

  return {
    userId: 'local',
    predictedLifespan,
    deathDate: deathDate.toISOString().split('T')[0],
    daysRemaining,
    longevityScore,
    insights,
  };
}

// Generate longevity improvement insights from user responses
function generateInsights(responses: UserResponse[]): PredictionResult['insights'] {
  const insightMap: Record<string, { title: string; description: string; category: string }> = {
    smoking: {
      category: 'Habits',
      title: 'Quit Smoking',
      description: 'Quitting smoking can add up to 10 years to your life. It\'s never too late to quit.',
    },
    exercise_frequency: {
      category: 'Exercise',
      title: 'Move More',
      description: 'Regular exercise reduces risk of heart disease, cancer, and mental decline.',
    },
    sleep_hours: {
      category: 'Sleep',
      title: 'Optimize Sleep',
      description: '7-9 hours of quality sleep is linked to longer lifespan and better health.',
    },
    diet_quality: {
      category: 'Diet',
      title: 'Eat Better',
      description: 'A whole-food diet rich in plants can add years to your life.',
    },
    stress_level: {
      category: 'Mental Health',
      title: 'Manage Stress',
      description: 'Chronic stress accelerates aging. Meditation and exercise can help.',
    },
    relationships: {
      category: 'Social',
      title: 'Build Connections',
      description: 'Strong social bonds are the #1 predictor of longevity in research.',
    },
    alcohol: {
      category: 'Habits',
      title: 'Moderate Alcohol',
      description: 'Reducing alcohol intake protects your liver, heart, and brain.',
    },
    water_intake: {
      category: 'Diet',
      title: 'Stay Hydrated',
      description: 'Proper hydration supports every system in your body.',
    },
  };

  return responses
    .filter((r) => r.impact < 0 && insightMap[r.questionId])
    .map((r) => ({
      ...insightMap[r.questionId],
      impact: 'negative' as const,
      yearsImpact: r.impact,
    }))
    .slice(0, 5); // Top 5 actionable insights
}
