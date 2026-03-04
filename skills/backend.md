# Backend Skill

Framework

Node.js
Express

Endpoints

POST /responses

Store questionnaire responses.

POST /predict

Send responses to prediction service.

GET /prediction/:userId

Return predicted lifespan.

POST /blood-tests

Store optional blood test values.

Security

Validate inputs.

Ensure numerical ranges are safe.

Example

age must be 18–100
sleep hours must be 0–24