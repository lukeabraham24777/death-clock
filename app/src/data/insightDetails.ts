// Deep content for each insight tip category
// Keyed by insight.title for lookup

export interface InsightSection {
  heading: string;
  body: string;
}

export interface InsightDetailContent {
  icon: string;
  headline: string;
  intro: string;
  sections: InsightSection[];
  quickTip: string;
}

export const insightDetails: Record<string, InsightDetailContent> = {
  'Quit Smoking': {
    icon: '🚭',
    headline: 'Why Quitting Smoking Adds Years',
    intro:
      'Smoking is the single most preventable cause of death worldwide. Each cigarette shortens your life by approximately 11 minutes.',
    sections: [
      {
        heading: 'What Smoking Does to Your Body',
        body: '• Damages the lining of your arteries, leading to atherosclerosis and heart attacks\n• Destroys alveoli in your lungs permanently — causing COPD and emphysema\n• Increases cancer risk in lungs, throat, mouth, bladder, kidney, and pancreas\n• Weakens your immune system, making infections harder to fight\n• Accelerates skin aging by reducing blood flow and breaking down collagen\n• Raises blood pressure and heart rate with every cigarette',
      },
      {
        heading: 'Timeline After Quitting',
        body: '• 20 minutes: Heart rate and blood pressure drop\n• 12 hours: Carbon monoxide levels return to normal\n• 2-12 weeks: Circulation and lung function improve\n• 1 year: Heart disease risk drops to half that of a smoker\n• 5 years: Stroke risk drops to that of a non-smoker\n• 10 years: Lung cancer risk falls to half\n• 15 years: Heart disease risk equals a non-smoker',
      },
      {
        heading: 'Strategies That Work',
        body: '• Nicotine replacement therapy (patches, gum, lozenges)\n• Prescription medications like varenicline (Chantix) or bupropion\n• Behavioral therapy and support groups\n• Gradual reduction: cut down by 1-2 cigarettes per week\n• Identify and avoid triggers — stress, alcohol, certain social situations\n• Exercise as a craving replacement — even a 5-minute walk helps',
      },
    ],
    quickTip: 'Set a quit date 2 weeks from now and tell someone about it. Social accountability doubles your success rate.',
  },

  'Move More': {
    icon: '🏃',
    headline: 'Exercise: The Closest Thing to a Miracle Drug',
    intro:
      'Regular physical activity reduces your risk of dying from ANY cause by 30-50%. Just 150 minutes per week of moderate activity can add 3-7 years to your life.',
    sections: [
      {
        heading: 'How Exercise Extends Life',
        body: '• Strengthens the heart muscle, lowering resting heart rate and blood pressure\n• Increases HDL (good cholesterol) and reduces triglycerides\n• Improves insulin sensitivity — reduces diabetes risk by 58%\n• Stimulates production of BDNF, protecting against cognitive decline\n• Strengthens bones and reduces fracture risk by 40%\n• Reduces chronic inflammation, the root of many diseases\n• Boosts immune function and reduces cancer risk by 20-30%',
      },
      {
        heading: 'What to Aim For',
        body: '• 150 minutes of moderate activity per week (brisk walking, cycling)\n• OR 75 minutes of vigorous activity (running, swimming, HIIT)\n• Strength training 2-3x per week for muscle and bone health\n• Daily movement: aim for 7,000-10,000 steps\n• Even 10 minutes of activity provides benefits\n• Consistency beats intensity — do something you enjoy',
      },
      {
        heading: 'Best Exercises for Longevity',
        body: '• Walking: simplest, lowest barrier, reduces mortality by 20%\n• Swimming: full-body, joint-friendly, reduces mortality by 28%\n• Cycling: cardiovascular health, can be transportation\n• Strength training: prevents sarcopenia (muscle loss with age)\n• Yoga/Stretching: flexibility, balance, stress reduction\n• Racquet sports: social + physical, linked to 9.7 extra years',
      },
    ],
    quickTip: 'Start with a 10-minute walk after dinner tonight. Small habits compound into life-changing results.',
  },

  'Optimize Sleep': {
    icon: '😴',
    headline: 'Sleep: Your Body\'s Repair Mode',
    intro:
      'Getting less than 6 hours of sleep per night increases your mortality risk by 12%. Sleep is when your body repairs DNA, consolidates memories, and fights disease.',
    sections: [
      {
        heading: 'Why Sleep Matters',
        body: '• During deep sleep, your brain flushes out toxic proteins linked to Alzheimer\'s\n• Growth hormone is released during sleep, repairing muscles and tissues\n• Your immune system produces cytokines that fight infection and inflammation\n• Sleep deprivation raises cortisol, increasing belly fat and heart disease risk\n• Poor sleep increases ghrelin (hunger hormone) and decreases leptin (satiety)\n• Just one night of bad sleep impairs decision-making as much as being legally drunk',
      },
      {
        heading: 'Optimal Sleep Habits',
        body: '• Aim for 7-9 hours per night (the sweet spot for longevity)\n• Keep a consistent sleep and wake time — even on weekends\n• Keep your bedroom cool (65-68°F / 18-20°C)\n• Block all light sources — use blackout curtains or an eye mask\n• Stop screens 30-60 minutes before bed (blue light suppresses melatonin)\n• Avoid caffeine after 2 PM — it has a 6-hour half-life\n• Limit alcohol before bed — it disrupts REM sleep',
      },
      {
        heading: 'Sleep Stages and Their Purpose',
        body: '• Light sleep (N1-N2): Body temperature drops, muscles relax\n• Deep sleep (N3): Physical repair, immune function, growth hormone release\n• REM sleep: Memory consolidation, emotional processing, creativity\n• You cycle through these stages 4-6 times per night\n• Deep sleep is most abundant in the first half of the night\n• REM sleep increases toward morning — don\'t cut it short',
      },
    ],
    quickTip: 'Set a phone alarm for 30 minutes before your target bedtime as a "wind down" reminder.',
  },

  'Eat Better': {
    icon: '🥗',
    headline: 'Nutrition: Fuel That Determines How Long You Run',
    intro:
      'Diet quality is responsible for an estimated 22% of all deaths globally. What you eat every day is the single biggest lever you have over your long-term health.',
    sections: [
      {
        heading: 'Foods That Extend Life',
        body: '• Leafy greens (spinach, kale, arugula) — packed with nitrates that lower blood pressure\n• Berries — rich in anthocyanins that reduce inflammation and protect the brain\n• Fatty fish (salmon, sardines, mackerel) — omega-3s reduce heart disease by 35%\n• Nuts and seeds — a handful daily reduces mortality by 20%\n• Legumes (beans, lentils, chickpeas) — the #1 food group in Blue Zone diets\n• Whole grains (oats, quinoa, brown rice) — fiber feeds beneficial gut bacteria\n• Olive oil — the cornerstone of the Mediterranean diet, reduces stroke risk by 41%',
      },
      {
        heading: 'Foods to Limit or Avoid',
        body: '• Ultra-processed foods — linked to 31% higher mortality risk\n• Sugary drinks — each daily serving increases diabetes risk by 26%\n• Processed meats (bacon, hot dogs, deli meats) — classified as Group 1 carcinogens\n• Trans fats — even small amounts increase heart disease risk significantly\n• Excessive red meat — limit to 1-2 servings per week\n• Refined carbohydrates — white bread, pastries spike blood sugar\n• Excess sodium — aim for under 2,300mg per day',
      },
      {
        heading: 'Caloric Guidelines',
        body: '• Average adult needs: 1,800-2,400 calories depending on activity level\n• Caloric restriction (without malnutrition) may extend lifespan by 10-20%\n• Focus on nutrient density, not just calorie count\n• Front-load calories: eat more earlier in the day, less at dinner\n• Time-restricted eating (8-10 hour window) shows promise in research\n• Stay hydrated: 8+ glasses of water daily supports every bodily function\n• The Mediterranean and Okinawan diets are the most studied longevity diets',
      },
    ],
    quickTip: 'Replace one processed snack today with a handful of nuts or a piece of fruit. Small swaps, big results over time.',
  },

  'Manage Stress': {
    icon: '🧘',
    headline: 'Stress: The Silent Life Shortener',
    intro:
      'Chronic stress accelerates biological aging by 9-17 years. It shrinks the prefrontal cortex, enlarges the amygdala, and shortens telomeres — the protective caps on your DNA.',
    sections: [
      {
        heading: 'How Stress Damages Your Body',
        body: '• Cortisol floods your system, raising blood pressure and blood sugar\n• Chronic inflammation damages blood vessels and organs\n• Immune system becomes suppressed — you get sick more often\n• Telomeres (DNA protective caps) shorten faster, accelerating aging\n• Increases visceral fat around organs — the most dangerous type\n• Disrupts sleep, digestion, and reproductive health\n• Linked to 6 leading causes of death: heart disease, cancer, lung disease, accidents, cirrhosis, suicide',
      },
      {
        heading: 'Proven Stress-Reduction Techniques',
        body: '• Meditation: just 10 minutes daily reduces cortisol by 14%\n• Deep breathing exercises: 4-7-8 technique (inhale 4s, hold 7s, exhale 8s)\n• Progressive muscle relaxation: tense and release muscle groups\n• Regular exercise: nature\'s best antidepressant and stress reliever\n• Journaling: writing about worries reduces their mental impact\n• Social connection: talking to a friend activates the parasympathetic nervous system\n• Time in nature: 20 minutes outdoors significantly lowers cortisol',
      },
      {
        heading: 'Building Resilience',
        body: '• Reframe challenges as growth opportunities\n• Practice gratitude: list 3 good things each evening\n• Set boundaries: saying "no" is a health behavior\n• Break large problems into small, actionable steps\n• Prioritize sleep — it\'s your brain\'s stress recovery mechanism\n• Limit news and social media consumption\n• Seek professional help if stress feels unmanageable — therapy is effective',
      },
    ],
    quickTip: 'Try the 4-7-8 breathing technique right now: inhale for 4 seconds, hold for 7, exhale for 8. Repeat 3 times.',
  },

  'Build Connections': {
    icon: '🤝',
    headline: 'Social Bonds: The #1 Predictor of Longevity',
    intro:
      'Loneliness increases mortality risk by 26% — equivalent to smoking 15 cigarettes a day. The Harvard Study of Adult Development (running since 1938) found that quality relationships are the strongest predictor of a long, healthy life.',
    sections: [
      {
        heading: 'Why Relationships Matter for Health',
        body: '• Social connection activates the parasympathetic nervous system, lowering cortisol\n• People with strong relationships have 50% higher survival rates\n• Marriage is associated with 2-3 extra years of life\n• Loneliness increases inflammation markers by 20-30%\n• Social isolation raises dementia risk by 50%\n• Having a sense of belonging reduces depression and anxiety\n• Helping others activates brain reward centers and reduces stress hormones',
      },
      {
        heading: 'Types of Connections That Matter',
        body: '• Deep friendships: 3-5 close friends is the optimal number for wellbeing\n• Romantic partnership: quality matters more than status\n• Community involvement: religious, volunteer, or social groups add years\n• Family bonds: regular contact with extended family reduces mortality\n• Weak ties: casual acquaintances (barista, neighbors) provide a sense of belonging\n• Pets: pet owners have lower blood pressure and reduced loneliness\n• Mentorship: both giving and receiving guidance strengthens purpose',
      },
      {
        heading: 'How to Strengthen Your Social Health',
        body: '• Schedule regular one-on-one time with people you value\n• Join a group around a shared interest (sports, hobbies, volunteering)\n• Practice active listening: put down your phone during conversations\n• Be vulnerable: sharing struggles deepens bonds\n• Reach out to one person you haven\'t spoken to in a while\n• Limit social media and increase in-person interaction\n• If isolated, start small: say hello to a neighbor, join a class, volunteer',
      },
    ],
    quickTip: 'Text or call one friend today that you haven\'t spoken to recently. Reconnection takes just one message.',
  },

  'Moderate Alcohol': {
    icon: '🍷',
    headline: 'Alcohol: Understanding the Real Risks',
    intro:
      'Recent research has overturned the "moderate drinking is healthy" myth. Any amount of alcohol carries health risks, though heavy drinking is exponentially more dangerous.',
    sections: [
      {
        heading: 'What Alcohol Does to Your Body',
        body: '• Liver: processes toxins but gets damaged — fatty liver → cirrhosis → liver failure\n• Brain: kills neurons and shrinks brain volume over time\n• Heart: heavy drinking weakens the heart muscle (cardiomyopathy)\n• Cancer: alcohol is a Group 1 carcinogen — linked to 7 types of cancer\n• Immune system: suppresses immune response for up to 24 hours after heavy drinking\n• Sleep: disrupts REM sleep, even if it helps you fall asleep initially\n• Mental health: depressant that worsens anxiety and depression long-term',
      },
      {
        heading: 'Guidelines for Harm Reduction',
        body: '• If you don\'t drink, there\'s no health reason to start\n• If you do drink, limit to 1 drink/day for women, 2 for men\n• Avoid binge drinking (4+ drinks in one sitting) — most harmful pattern\n• Have 3-4 alcohol-free days per week minimum\n• Drink water between alcoholic beverages\n• Eat before and while drinking to slow absorption\n• Track your intake — most people underestimate by 30-50%',
      },
      {
        heading: 'Benefits of Cutting Back',
        body: '• Better sleep quality within the first week\n• Weight loss: alcohol is 7 calories/gram with zero nutritional value\n• Clearer skin and reduced puffiness\n• Improved mood and reduced anxiety\n• Lower blood pressure within 2-4 weeks\n• Better immune function\n• Significant cost savings over time',
      },
    ],
    quickTip: 'Try replacing your next drink with a sparkling water with lime. You might be surprised how satisfying it is.',
  },

  'Stay Hydrated': {
    icon: '💧',
    headline: 'Hydration: The Overlooked Health Essential',
    intro:
      'Even mild dehydration (1-2%) impairs cognitive function, mood, and physical performance. Chronic under-hydration is linked to faster biological aging.',
    sections: [
      {
        heading: 'Why Water Matters',
        body: '• Your body is ~60% water — every cell depends on it\n• Kidneys need water to filter 200 quarts of blood daily\n• Dehydration thickens blood, making the heart work harder\n• Water cushions joints and protects the spinal cord\n• Proper hydration supports healthy skin and slows wrinkle formation\n• Helps regulate body temperature through sweating\n• Supports digestion and prevents constipation',
      },
      {
        heading: 'How Much to Drink',
        body: '• General guideline: 8 glasses (64 oz / ~2 liters) per day minimum\n• More accurate: drink half your body weight in ounces\n• Increase intake during exercise, hot weather, or illness\n• Check urine color: pale yellow = well hydrated, dark = drink more\n• Coffee and tea count, but limit caffeine to 400mg/day\n• Fruits and vegetables contribute 20% of daily water intake\n• Spread intake throughout the day rather than large amounts at once',
      },
      {
        heading: 'Hydration Tips',
        body: '• Keep a water bottle visible at all times\n• Drink a glass of water first thing in the morning\n• Set phone reminders if you forget to drink\n• Flavor water with lemon, cucumber, or berries if plain water bores you\n• Eat water-rich foods: watermelon, cucumbers, oranges, strawberries\n• Drink a glass before each meal — also helps with portion control\n• Replace sugary drinks with sparkling water',
      },
    ],
    quickTip: 'Fill a water bottle right now and keep it within arm\'s reach for the rest of the day.',
  },
};
