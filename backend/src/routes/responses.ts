import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// POST /api/responses - Store questionnaire responses
router.post('/', async (req: Request, res: Response) => {
  const { userId, responses } = req.body;

  try {
    // Create user if no userId provided
    let uid = userId;
    if (!uid) {
      const result = await pool.query(
        'INSERT INTO users DEFAULT VALUES RETURNING id'
      );
      uid = result.rows[0].id;
    }

    // Insert all responses in a batch
    const values: string[] = [];
    const params: (string | number)[] = [];
    let paramIndex = 1;

    for (const response of responses) {
      values.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`);
      params.push(uid, response.questionId, String(response.answer), response.impact ?? 0);
      paramIndex += 4;
    }

    if (values.length > 0) {
      await pool.query(
        `INSERT INTO responses (user_id, question_id, answer, impact) VALUES ${values.join(', ')}`,
        params
      );
    }

    res.status(201).json({ userId: uid, count: responses.length });
  } catch (error) {
    console.error('Error saving responses:', error);
    res.status(500).json({ message: 'Failed to save responses' });
  }
});

export default router;
