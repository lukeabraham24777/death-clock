import { Question } from '../types';

// 30 lifestyle questions organized by category
// Each question contributes to the prediction model through impact scores
export const questions: Question[] = [
  // === DEMOGRAPHICS (1-4) ===
  {
    id: 'birth_date',
    text: 'When were you born?',
    subtitle: 'This is the foundation of your prediction',
    type: 'date',
    category: 'demographics',
  },
  {
    id: 'sex',
    text: 'What is your biological sex?',
    type: 'single',
    category: 'demographics',
    options: [
      { label: 'Male', value: 'male', impact: -2 },
      { label: 'Female', value: 'female', impact: 2 },
    ],
  },
  {
    id: 'height',
    text: 'How tall are you?',
    subtitle: 'In inches',
    type: 'number',
    min: 48,
    max: 84,
    unit: 'in',
    category: 'demographics',
  },
  {
    id: 'weight',
    text: 'How much do you weigh?',
    subtitle: 'In pounds',
    type: 'number',
    min: 80,
    max: 500,
    unit: 'lbs',
    category: 'demographics',
    microReward: 'Body composition is a key health indicator',
  },

  // === EXERCISE (5-8) ===
  {
    id: 'exercise_frequency',
    text: 'How often do you exercise?',
    type: 'single',
    category: 'exercise',
    options: [
      { label: 'Never', value: 'never', impact: -3 },
      { label: '1-2 times/week', value: 'light', impact: 0 },
      { label: '3-4 times/week', value: 'moderate', impact: 2 },
      { label: '5+ times/week', value: 'daily', impact: 3 },
    ],
    microReward: 'Exercise adds years to your life!',
  },
  {
    id: 'exercise_type',
    text: 'What type of exercise do you do most?',
    type: 'single',
    category: 'exercise',
    options: [
      { label: 'None', value: 'none', impact: -1 },
      { label: 'Walking', value: 'walking', impact: 1 },
      { label: 'Cardio', value: 'cardio', impact: 2 },
      { label: 'Strength training', value: 'strength', impact: 2 },
      { label: 'Mixed/Both', value: 'mixed', impact: 3 },
    ],
  },
  {
    id: 'daily_steps',
    text: 'How many steps do you average daily?',
    type: 'single',
    category: 'exercise',
    options: [
      { label: 'Under 3,000', value: 'sedentary', impact: -2 },
      { label: '3,000 - 7,000', value: 'low', impact: 0 },
      { label: '7,000 - 10,000', value: 'moderate', impact: 1 },
      { label: 'Over 10,000', value: 'active', impact: 2 },
    ],
    microReward: 'Every step counts toward a longer life',
  },
  {
    id: 'sedentary_hours',
    text: 'Hours spent sitting per day?',
    type: 'slider',
    min: 1,
    max: 16,
    unit: 'hours',
    category: 'exercise',
  },

  // === DIET (9-13) ===
  {
    id: 'diet_quality',
    text: 'How would you describe your diet?',
    type: 'single',
    category: 'diet',
    options: [
      { label: 'Mostly fast food', value: 'poor', impact: -3 },
      { label: 'Average', value: 'average', impact: 0 },
      { label: 'Mostly healthy', value: 'good', impact: 2 },
      { label: 'Very clean / whole foods', value: 'excellent', impact: 3 },
    ],
  },
  {
    id: 'fruits_veggies',
    text: 'How many servings of fruits & vegetables daily?',
    type: 'single',
    category: 'diet',
    options: [
      { label: '0-1 servings', value: 'low', impact: -1 },
      { label: '2-3 servings', value: 'moderate', impact: 0 },
      { label: '4-5 servings', value: 'good', impact: 1 },
      { label: '6+ servings', value: 'excellent', impact: 2 },
    ],
    microReward: 'A plant-rich diet is linked to longevity',
  },
  {
    id: 'water_intake',
    text: 'How many glasses of water do you drink daily?',
    type: 'single',
    category: 'diet',
    options: [
      { label: '0-2 glasses', value: 'low', impact: -1 },
      { label: '3-5 glasses', value: 'moderate', impact: 0 },
      { label: '6-8 glasses', value: 'good', impact: 1 },
      { label: '8+ glasses', value: 'excellent', impact: 1 },
    ],
  },
  {
    id: 'processed_food',
    text: 'How often do you eat processed food?',
    type: 'single',
    category: 'diet',
    options: [
      { label: 'Every meal', value: 'always', impact: -3 },
      { label: 'Daily', value: 'daily', impact: -1 },
      { label: 'A few times a week', value: 'sometimes', impact: 0 },
      { label: 'Rarely / Never', value: 'rarely', impact: 1 },
    ],
  },
  {
    id: 'sugar_intake',
    text: 'How much sugar do you consume?',
    type: 'single',
    category: 'diet',
    options: [
      { label: 'Very high (sodas, sweets daily)', value: 'high', impact: -2 },
      { label: 'Moderate', value: 'moderate', impact: 0 },
      { label: 'Low / Minimal', value: 'low', impact: 1 },
    ],
  },

  // === SLEEP (14-16) ===
  {
    id: 'sleep_hours',
    text: 'How many hours of sleep do you get?',
    type: 'slider',
    min: 3,
    max: 12,
    unit: 'hours',
    category: 'sleep',
    microReward: 'Good sleep is one of the strongest predictors of longevity',
  },
  {
    id: 'sleep_quality',
    text: 'How would you rate your sleep quality?',
    type: 'single',
    category: 'sleep',
    options: [
      { label: 'Poor - I rarely feel rested', value: 'poor', impact: -2 },
      { label: 'Fair - Sometimes restful', value: 'fair', impact: 0 },
      { label: 'Good - Usually rested', value: 'good', impact: 1 },
      { label: 'Excellent - Always rested', value: 'excellent', impact: 2 },
    ],
  },
  {
    id: 'sleep_consistency',
    text: 'Do you go to bed at a consistent time?',
    type: 'single',
    category: 'sleep',
    options: [
      { label: 'Very inconsistent', value: 'inconsistent', impact: -1 },
      { label: 'Somewhat consistent', value: 'somewhat', impact: 0 },
      { label: 'Very consistent', value: 'consistent', impact: 1 },
    ],
  },

  // === HABITS (17-21) ===
  {
    id: 'smoking',
    text: 'Do you smoke?',
    type: 'single',
    category: 'habits',
    options: [
      { label: 'Yes, regularly', value: 'heavy', impact: -8 },
      { label: 'Occasionally', value: 'light', impact: -4 },
      { label: 'I quit', value: 'quit', impact: -1 },
      { label: 'Never', value: 'never', impact: 1 },
    ],
  },
  {
    id: 'alcohol',
    text: 'How often do you drink alcohol?',
    type: 'single',
    category: 'habits',
    options: [
      { label: 'Daily / Heavy', value: 'heavy', impact: -4 },
      { label: 'Several times a week', value: 'moderate', impact: -1 },
      { label: 'Occasionally', value: 'light', impact: 0 },
      { label: 'Rarely / Never', value: 'never', impact: 1 },
    ],
    microReward: 'Moderation is key for a longer life',
  },
  {
    id: 'drugs',
    text: 'Do you use recreational drugs?',
    type: 'single',
    category: 'habits',
    options: [
      { label: 'Regularly', value: 'regular', impact: -4 },
      { label: 'Occasionally', value: 'occasional', impact: -1 },
      { label: 'Never', value: 'never', impact: 0 },
    ],
  },
  {
    id: 'sunscreen',
    text: 'Do you wear sunscreen regularly?',
    type: 'single',
    category: 'habits',
    options: [
      { label: 'Never', value: 'never', impact: -1 },
      { label: 'Sometimes', value: 'sometimes', impact: 0 },
      { label: 'Always', value: 'always', impact: 1 },
    ],
  },
  {
    id: 'seatbelt',
    text: 'Do you always wear a seatbelt?',
    type: 'single',
    category: 'habits',
    options: [
      { label: 'Rarely', value: 'rarely', impact: -1 },
      { label: 'Most of the time', value: 'usually', impact: 0 },
      { label: 'Always', value: 'always', impact: 0 },
    ],
  },

  // === MENTAL HEALTH (22-25) ===
  {
    id: 'stress_level',
    text: 'How stressed do you feel on a daily basis?',
    type: 'single',
    category: 'mental_health',
    options: [
      { label: 'Extremely stressed', value: 'extreme', impact: -3 },
      { label: 'Quite stressed', value: 'high', impact: -2 },
      { label: 'Moderately stressed', value: 'moderate', impact: -1 },
      { label: 'Low stress', value: 'low', impact: 1 },
    ],
  },
  {
    id: 'happiness',
    text: 'How would you rate your overall happiness?',
    type: 'slider',
    min: 1,
    max: 10,
    unit: '/10',
    category: 'mental_health',
    microReward: 'Happiness and purpose are linked to longer life',
  },
  {
    id: 'mindfulness',
    text: 'Do you practice meditation or mindfulness?',
    type: 'single',
    category: 'mental_health',
    options: [
      { label: 'Never', value: 'never', impact: 0 },
      { label: 'Occasionally', value: 'occasionally', impact: 1 },
      { label: 'Regularly', value: 'regularly', impact: 2 },
    ],
  },
  {
    id: 'purpose',
    text: 'Do you feel a strong sense of purpose in life?',
    type: 'single',
    category: 'mental_health',
    options: [
      { label: 'Not at all', value: 'none', impact: -1 },
      { label: 'Somewhat', value: 'somewhat', impact: 0 },
      { label: 'Definitely', value: 'strong', impact: 2 },
    ],
  },

  // === SOCIAL (26-28) ===
  {
    id: 'relationships',
    text: 'How would you describe your social connections?',
    type: 'single',
    category: 'social',
    options: [
      { label: 'Very isolated', value: 'isolated', impact: -3 },
      { label: 'A few close friends', value: 'small', impact: 1 },
      { label: 'Strong social circle', value: 'strong', impact: 2 },
      { label: 'Very connected community', value: 'community', impact: 3 },
    ],
    microReward: 'Strong relationships are the #1 predictor of longevity',
  },
  {
    id: 'marital_status',
    text: 'What is your relationship status?',
    type: 'single',
    category: 'social',
    options: [
      { label: 'Single', value: 'single', impact: 0 },
      { label: 'In a relationship', value: 'relationship', impact: 1 },
      { label: 'Married', value: 'married', impact: 2 },
      { label: 'Divorced / Widowed', value: 'divorced', impact: -1 },
    ],
  },
  {
    id: 'pets',
    text: 'Do you have pets?',
    type: 'single',
    category: 'social',
    options: [
      { label: 'No', value: 'no', impact: 0 },
      { label: 'Yes', value: 'yes', impact: 1 },
    ],
    microReward: 'Pet owners tend to live longer!',
  },

  // === MEDICAL (29-30) ===
  {
    id: 'family_longevity',
    text: 'Did your grandparents live past 80?',
    type: 'single',
    category: 'medical',
    options: [
      { label: 'None of them', value: 'none', impact: -2 },
      { label: 'Some of them', value: 'some', impact: 0 },
      { label: 'Most / All of them', value: 'most', impact: 3 },
    ],
    microReward: 'Genetics play a role, but lifestyle matters more',
  },
  {
    id: 'chronic_conditions',
    text: 'Do you have any chronic health conditions?',
    subtitle: 'Diabetes, heart disease, hypertension, etc.',
    type: 'single',
    category: 'medical',
    options: [
      { label: 'Multiple conditions', value: 'multiple', impact: -5 },
      { label: 'One condition', value: 'one', impact: -2 },
      { label: 'None', value: 'none', impact: 1 },
    ],
  },
];
