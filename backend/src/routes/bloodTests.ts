import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// POST /api/blood-tests - Store blood test values and adjust prediction
router.post('/', async (req: Request, res: Response) => {
  const { userId, hdl, ldl, cholesterol, glucose } = req.body;

  try {
    // Store blood test data
    await pool.query(
      `INSERT INTO blood_tests (user_id, hdl, ldl, cholesterol, glucose)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, hdl || null, ldl || null, cholesterol || null, glucose || null]
    );

    // Calculate blood test impact on prediction
    let bloodTestImpact = 0;

    // HDL (good cholesterol) - higher is better
    if (hdl) {
      if (hdl >= 60) bloodTestImpact += 1;
      else if (hdl < 40) bloodTestImpact -= 1;
    }

    // LDL (bad cholesterol) - lower is better
    if (ldl) {
      if (ldl < 100) bloodTestImpact += 1;
      else if (ldl > 160) bloodTestImpact -= 2;
    }

    // Total cholesterol
    if (cholesterol) {
      if (cholesterol < 200) bloodTestImpact += 1;
      else if (cholesterol > 240) bloodTestImpact -= 1;
    }

    // Fasting glucose
    if (glucose) {
      if (glucose < 100) bloodTestImpact += 1;
      else if (glucose > 126) bloodTestImpact -= 2; // Diabetic range
    }

    // Update existing prediction with blood test adjustment
    const existing = await pool.query(
      `SELECT * FROM predictions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (existing.rows.length > 0) {
      const pred = existing.rows[0];
      const newLifespan = Math.max(40, Math.min(110, pred.predicted_lifespan + bloodTestImpact));

      // Recalculate death date based on birth (from original responses)
      const responsesResult = await pool.query(
        `SELECT answer FROM responses WHERE user_id = $1 AND question_id = 'birth_date' LIMIT 1`,
        [userId]
      );

      const birthDate = responsesResult.rows[0]?.answer || '1990-01-01';
      const birth = new Date(birthDate);
      const deathDate = new Date(birth);
      deathDate.setFullYear(deathDate.getFullYear() + newLifespan);

      const daysRemaining = Math.max(0, Math.floor(
        (deathDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ));

      const newScore = Math.max(0, Math.min(100,
        pred.longevity_score + (bloodTestImpact * 3)
      ));

      // Insert updated prediction
      await pool.query(
        `INSERT INTO predictions (user_id, predicted_lifespan, death_date, days_remaining, longevity_score, insights)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, newLifespan, deathDate.toISOString().split('T')[0], daysRemaining, newScore, pred.insights]
      );

      return res.json({
        userId,
        predictedLifespan: newLifespan,
        deathDate: deathDate.toISOString().split('T')[0],
        daysRemaining,
        longevityScore: newScore,
        insights: pred.insights,
        bloodTestImpact,
      });
    }

    res.status(404).json({ message: 'No existing prediction found for this user' });
  } catch (error) {
    console.error('Error processing blood tests:', error);
    res.status(500).json({ message: 'Failed to process blood tests' });
  }
});

export default router;
