"""
Death Clock Prediction Model

Rule-based life expectancy prediction for MVP.
Uses lifestyle factors to adjust a base life expectancy.
"""

from datetime import datetime, timedelta

# Base life expectancy (global average, slightly above US average)
BASE_LIFE_EXPECTANCY = 78

# Insight templates for actionable health improvements
INSIGHT_TEMPLATES = {
    "smoking": {
        "category": "Habits",
        "title": "Quit Smoking",
        "description": "Quitting smoking can add up to 10 years to your life. It's never too late to quit.",
    },
    "exercise_frequency": {
        "category": "Exercise",
        "title": "Move More",
        "description": "Regular exercise reduces risk of heart disease, cancer, and mental decline.",
    },
    "sleep_hours": {
        "category": "Sleep",
        "title": "Optimize Sleep",
        "description": "7-9 hours of quality sleep is linked to longer lifespan and better health.",
    },
    "diet_quality": {
        "category": "Diet",
        "title": "Eat Better",
        "description": "A whole-food diet rich in plants can add years to your life.",
    },
    "stress_level": {
        "category": "Mental Health",
        "title": "Manage Stress",
        "description": "Chronic stress accelerates aging. Meditation and exercise can help.",
    },
    "relationships": {
        "category": "Social",
        "title": "Build Connections",
        "description": "Strong social bonds are the #1 predictor of longevity in research.",
    },
    "alcohol": {
        "category": "Habits",
        "title": "Moderate Alcohol",
        "description": "Reducing alcohol intake protects your liver, heart, and brain.",
    },
    "water_intake": {
        "category": "Diet",
        "title": "Stay Hydrated",
        "description": "Proper hydration supports every system in your body.",
    },
    "sedentary_hours": {
        "category": "Exercise",
        "title": "Sit Less",
        "description": "Prolonged sitting increases risk of heart disease and early death.",
    },
    "chronic_conditions": {
        "category": "Medical",
        "title": "Manage Health Conditions",
        "description": "Proper treatment of chronic conditions can significantly extend life.",
    },
}


def predict(responses: list, birth_date: str) -> dict:
    """
    Calculate predicted lifespan based on questionnaire responses.

    Args:
        responses: List of {questionId, answer, impact} dicts
        birth_date: ISO format date string (YYYY-MM-DD)

    Returns:
        Dictionary with prediction results and insights
    """
    # Sum all impact scores from responses
    total_impact = sum(r.get("impact", 0) for r in responses)

    # Clamp predicted lifespan to reasonable bounds
    predicted_lifespan = max(40, min(110, BASE_LIFE_EXPECTANCY + total_impact))

    # Calculate death date from birth date
    birth = datetime.strptime(birth_date, "%Y-%m-%d")
    death_date = birth.replace(year=birth.year + predicted_lifespan)

    # Calculate days remaining from today
    now = datetime.now()
    days_remaining = max(0, (death_date - now).days)

    # Calculate longevity score (0-100)
    longevity_score = max(0, min(100, round(50 + total_impact * 3)))

    # Generate actionable insights for negative-impact responses
    insights = generate_insights(responses)

    return {
        "predictedLifespan": predicted_lifespan,
        "deathDate": death_date.strftime("%Y-%m-%d"),
        "daysRemaining": days_remaining,
        "longevityScore": longevity_score,
        "insights": insights,
    }


def generate_insights(responses: list) -> list:
    """
    Generate longevity improvement insights based on negative-impact responses.
    Returns up to 5 actionable insights.
    """
    insights = []

    for r in responses:
        question_id = r.get("questionId", "")
        impact = r.get("impact", 0)

        if impact < 0 and question_id in INSIGHT_TEMPLATES:
            template = INSIGHT_TEMPLATES[question_id]
            insights.append(
                {
                    "category": template["category"],
                    "title": template["title"],
                    "description": template["description"],
                    "impact": "negative",
                    "yearsImpact": impact,
                }
            )

    # Sort by most impactful (most negative first)
    insights.sort(key=lambda x: x["yearsImpact"])

    return insights[:5]


def adjust_for_blood_tests(
    prediction: dict, hdl=None, ldl=None, cholesterol=None, glucose=None
) -> dict:
    """
    Adjust an existing prediction based on blood test results.

    Args:
        prediction: Existing prediction dict
        hdl: HDL cholesterol (mg/dL)
        ldl: LDL cholesterol (mg/dL)
        cholesterol: Total cholesterol (mg/dL)
        glucose: Fasting glucose (mg/dL)

    Returns:
        Updated prediction dict
    """
    adjustment = 0

    if hdl is not None:
        if hdl >= 60:
            adjustment += 1
        elif hdl < 40:
            adjustment -= 1

    if ldl is not None:
        if ldl < 100:
            adjustment += 1
        elif ldl > 160:
            adjustment -= 2

    if cholesterol is not None:
        if cholesterol < 200:
            adjustment += 1
        elif cholesterol > 240:
            adjustment -= 1

    if glucose is not None:
        if glucose < 100:
            adjustment += 1
        elif glucose > 126:
            adjustment -= 2

    # Apply adjustment
    new_lifespan = max(
        40, min(110, prediction["predictedLifespan"] + adjustment)
    )
    prediction["predictedLifespan"] = new_lifespan
    prediction["longevityScore"] = max(
        0, min(100, prediction["longevityScore"] + adjustment * 3)
    )

    return prediction
