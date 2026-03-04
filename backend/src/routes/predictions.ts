import { Router, Request, Response } from 'express';
import axios from 'axios';
import pool from '../db';

const router = Router();

const PREDICTION_SERVICE_URL = process.env.PREDICTION_SERVICE_URL || 'http://localhost:5000';

// POST /api/predict - Send responses to prediction service and store result
router.post('/', async (req: Request, res: Response) => {
  const { responses, birthDate } = req.body;

  try {
    // Create a new user for this prediction
    const userResult = await pool.query(
      'INSERT INTO users DEFAULT VALUES RETURNING id'
    );
    const userId = userResult.rows[0].id;

    // Store the responses
    const values: string[] = [];
    const params: (string | number)[] = [];
    let paramIndex = 1;

    for (const response of responses) {
      values.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`);
      params.push(userId, response.questionId, String(response.answer), response.impact ?? 0);
      paramIndex += 4;
    }

    if (values.length > 0) {
      await pool.query(
        `INSERT INTO responses (user_id, question_id, answer, impact) VALUES ${values.join(', ')}`,
        params
      );
    }

    // Call the Python prediction service
    let prediction;
    try {
      const predictionResponse = await axios.post(`${PREDICTION_SERVICE_URL}/predict`, {
        responses,
        birth_date: birthDate,
      }, { timeout: 10000 });
      prediction = predictionResponse.data;
    } catch {
      // Fallback: calculate locally if prediction service is down
      prediction = calculateFallback(responses, birthDate);
    }

    // Store the prediction
    await pool.query(
      `INSERT INTO predictions (user_id, predicted_lifespan, death_date, days_remaining, longevity_score, insights)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        prediction.predictedLifespan,
        prediction.deathDate,
        prediction.daysRemaining,
        prediction.longevityScore,
        JSON.stringify(prediction.insights || []),
      ]
    );

    res.json({
      userId,
      ...prediction,
    });
  } catch (error) {
    console.error('Error creating prediction:', error);
    res.status(500).json({ message: 'Failed to create prediction' });
  }
});

// GET /api/prediction/:userId - Return existing prediction
router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM predictions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    const row = result.rows[0];

    // Recalculate days remaining (it changes daily)
    const deathDate = new Date(row.death_date);
    const daysRemaining = Math.max(0, Math.floor(
      (deathDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ));

    res.json({
      userId: row.user_id,
      predictedLifespan: row.predicted_lifespan,
      deathDate: row.death_date,
      daysRemaining,
      longevityScore: row.longevity_score,
      insights: row.insights,
    });
  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({ message: 'Failed to fetch prediction' });
  }
});

// Fallback prediction calculator (mirrors Python service logic)
function calculateFallback(responses: any[], birthDate: string) {
  const BASE_LIFE_EXPECTANCY = 78;
  const totalImpact = responses.reduce((sum: number, r: any) => sum + (r.impact || 0), 0);
  const predictedLifespan = Math.max(40, Math.min(110, BASE_LIFE_EXPECTANCY + totalImpact));

  const birth = new Date(birthDate);
  const deathDate = new Date(birth);
  deathDate.setFullYear(deathDate.getFullYear() + predictedLifespan);

  const daysRemaining = Math.max(0, Math.floor(
    (deathDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));

  const longevityScore = Math.max(0, Math.min(100, Math.round(50 + totalImpact * 3)));

  return {
    predictedLifespan,
    deathDate: deathDate.toISOString().split('T')[0],
    daysRemaining,
    longevityScore,
    insights: [],
  };
}

export default router;
