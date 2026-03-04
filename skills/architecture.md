# Architecture Skill

Use a modular architecture.

Structure:

mobile-app
backend-api
prediction-service

Communication Flow

Mobile App → Backend API → Prediction Service → Database

Guidelines

Keep the mobile app lightweight.

All prediction logic should live in the prediction service.

The backend API should handle:

user responses
prediction requests
database writes
analytics

Mobile app responsibilities:

UI
questionnaire
countdown timer
share card generation

Prediction service responsibilities:

calculate life expectancy
adjust prediction based on inputs
return lifespan estimate

Database responsibilities:

store responses
store predictions
store blood test values