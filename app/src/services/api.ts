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

/**
 * Safely parse a birth date string into a valid Date object.
 * Accepts YYYY-MM-DD, MM-DD-YYYY, or raw digits.
 * Returns null if parsing fails.
 */
function parseBirthDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') return null;

  // Try YYYY-MM-DD format first
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    if (!isNaN(date.getTime()) && date.getFullYear() >= 1900 && date.getFullYear() <= 2025) {
      return date;
    }
  }

  // Try MM-DD-YYYY format
  const usMatch = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (usMatch) {
    const [, m, d, y] = usMatch;
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    if (!isNaN(date.getTime()) && date.getFullYear() >= 1900 && date.getFullYear() <= 2025) {
      return date;
    }
  }

  // Try raw digits MMDDYYYY or YYYYMMDD
  const digits = dateStr.replace(/\D/g, '');
  if (digits.length === 8) {
    // Try MMDDYYYY
    const mm = parseInt(digits.slice(0, 2));
    const dd = parseInt(digits.slice(2, 4));
    const yyyy = parseInt(digits.slice(4, 8));
    if (yyyy >= 1900 && yyyy <= 2025 && mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
      return new Date(yyyy, mm - 1, dd);
    }
    // Try YYYYMMDD
    const y2 = parseInt(digits.slice(0, 4));
    const m2 = parseInt(digits.slice(4, 6));
    const d2 = parseInt(digits.slice(6, 8));
    if (y2 >= 1900 && y2 <= 2025 && m2 >= 1 && m2 <= 12 && d2 >= 1 && d2 <= 31) {
      return new Date(y2, m2 - 1, d2);
    }
  }

  return null;
}

/**
 * Local prediction engine — computes life expectancy from questionnaire responses.
 * Uses base expectancy adjusted by lifestyle impact scores, BMI, and sex.
 */
export function calculateLocalPrediction(
  responses: UserResponse[],
  birthDate: string
): PredictionResult {
  // --- Parse birth date robustly ---
  const birth = parseBirthDate(birthDate) ?? new Date(1990, 0, 1); // fallback Jan 1 1990
  const now = new Date();

  // Current age in years
  let currentAge = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    currentAge--;
  }
  currentAge = Math.max(1, Math.min(120, currentAge));

  // --- Base life expectancy by sex ---
  const sexResponse = responses.find((r) => r.questionId === 'sex');
  const sex = sexResponse?.answer ?? 'male';
  // Women live ~5 years longer on average
  const BASE_EXPECTANCY = sex === 'female' ? 81 : 76;

  // --- Sum lifestyle impact scores from responses ---
  const totalImpact = responses.reduce((sum, r) => sum + r.impact, 0);

  // --- BMI adjustment from height + weight ---
  let bmiAdjustment = 0;
  const heightResp = responses.find((r) => r.questionId === 'height');
  const weightResp = responses.find((r) => r.questionId === 'weight');
  if (heightResp && weightResp) {
    const heightInches = parseFloat(heightResp.answer);
    const weightLbs = parseFloat(weightResp.answer);
    if (heightInches > 0 && weightLbs > 0) {
      const bmi = (weightLbs * 703) / (heightInches * heightInches);
      if (bmi < 18.5) bmiAdjustment = -2;        // underweight
      else if (bmi >= 18.5 && bmi < 25) bmiAdjustment = 2;  // healthy
      else if (bmi >= 25 && bmi < 30) bmiAdjustment = -1;   // overweight
      else if (bmi >= 30 && bmi < 35) bmiAdjustment = -3;   // obese class I
      else bmiAdjustment = -5;                     // obese class II+
    }
  }

  // --- Compute predicted total lifespan ---
  // Combine base + lifestyle impacts + BMI, clamped to [45, 110]
  const rawLifespan = BASE_EXPECTANCY + totalImpact + bmiAdjustment;
  const predictedLifespan = Math.max(45, Math.min(110, rawLifespan));

  // --- Calculate death date by adding predictedLifespan years to birth ---
  const deathDate = new Date(birth.getTime());
  deathDate.setFullYear(birth.getFullYear() + predictedLifespan);

  // Sanity check: death date must be in the future (at minimum current year)
  // If not, set to at least 1 year from now
  if (deathDate.getTime() <= now.getTime()) {
    deathDate.setTime(now.getTime());
    deathDate.setFullYear(deathDate.getFullYear() + 1);
  }

  // --- Days remaining ---
  const daysRemaining = Math.max(0, Math.floor(
    (deathDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  ));

  // --- Longevity score (0-100) ---
  // Based on how far above/below average the predicted lifespan is
  const avgExpectancy = 78;
  const deviation = predictedLifespan - avgExpectancy;
  const longevityScore = Math.max(0, Math.min(100,
    Math.round(50 + (deviation * 3))
  ));

  // --- Format death date as YYYY-MM-DD ---
  const deathYear = deathDate.getFullYear();
  const deathMonth = String(deathDate.getMonth() + 1).padStart(2, '0');
  const deathDay = String(deathDate.getDate()).padStart(2, '0');
  const deathDateStr = `${deathYear}-${deathMonth}-${deathDay}`;

  // --- Generate insights ---
  const insights = generateInsights(responses);

  return {
    userId: 'local',
    predictedLifespan,
    deathDate: deathDateStr,
    daysRemaining,
    longevityScore,
    insights,
  };
}

// Generate ALL longevity insights — both negative (needs improvement) and positive (well done)
function generateInsights(responses: UserResponse[]): PredictionResult['insights'] {
  const insightMap: Record<string, {
    title: string;
    description: string;
    category: string;
    positiveDesc: string; // shown when user is already doing well
  }> = {
    smoking: {
      category: 'Habits',
      title: 'Quit Smoking',
      description: 'Quitting smoking can add up to 10 years to your life. It\'s never too late to quit.',
      positiveDesc: 'You don\'t smoke — this alone adds years to your life. Keep it up!',
    },
    exercise_frequency: {
      category: 'Exercise',
      title: 'Move More',
      description: 'Regular exercise reduces risk of heart disease, cancer, and mental decline.',
      positiveDesc: 'Your exercise routine is adding years to your life. Stay active!',
    },
    sleep_hours: {
      category: 'Sleep',
      title: 'Optimize Sleep',
      description: '7-9 hours of quality sleep is linked to longer lifespan and better health.',
      positiveDesc: 'Your sleep habits are excellent — your body thanks you every night.',
    },
    diet_quality: {
      category: 'Diet',
      title: 'Eat Better',
      description: 'A whole-food diet rich in plants can add years to your life.',
      positiveDesc: 'Your healthy diet is one of the best investments in longevity. Well done!',
    },
    stress_level: {
      category: 'Mental Health',
      title: 'Manage Stress',
      description: 'Chronic stress accelerates aging. Meditation and exercise can help.',
      positiveDesc: 'Your low stress levels protect your telomeres and keep you young. Keep it calm!',
    },
    relationships: {
      category: 'Social',
      title: 'Build Connections',
      description: 'Strong social bonds are the #1 predictor of longevity in research.',
      positiveDesc: 'Your strong social bonds are the #1 predictor of a long life. Cherish them!',
    },
    alcohol: {
      category: 'Habits',
      title: 'Moderate Alcohol',
      description: 'Reducing alcohol intake protects your liver, heart, and brain.',
      positiveDesc: 'Your moderate alcohol habits protect your liver, heart, and brain. Smart choice!',
    },
    water_intake: {
      category: 'Diet',
      title: 'Stay Hydrated',
      description: 'Proper hydration supports every system in your body.',
      positiveDesc: 'Great hydration habits! Every cell in your body benefits from this.',
    },
  };

  const results: PredictionResult['insights'] = [];

  // First add all negative-impact insights (needs improvement)
  for (const r of responses) {
    if (r.impact < 0 && insightMap[r.questionId]) {
      results.push({
        ...insightMap[r.questionId],
        impact: 'negative' as const,
        yearsImpact: r.impact,
      });
    }
  }

  // Then add positive/neutral insights (well done) for remaining categories
  for (const r of responses) {
    if (r.impact >= 0 && insightMap[r.questionId]) {
      const entry = insightMap[r.questionId];
      results.push({
        category: entry.category,
        title: entry.title,
        description: entry.positiveDesc,
        impact: 'positive' as const,
        yearsImpact: r.impact,
      });
    }
  }

  return results.slice(0, 8); // Show up to 8 insights
}
