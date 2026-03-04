import { Request, Response, NextFunction } from 'express';

// Validate questionnaire response submissions
export function validateResponses(req: Request, res: Response, next: NextFunction) {
  const { responses, birthDate } = req.body;

  if (!responses || !Array.isArray(responses)) {
    return res.status(400).json({ message: 'responses must be an array' });
  }

  if (responses.length === 0) {
    return res.status(400).json({ message: 'At least one response is required' });
  }

  // Validate each response has required fields
  for (const response of responses) {
    if (!response.questionId || typeof response.questionId !== 'string') {
      return res.status(400).json({ message: 'Each response must have a questionId string' });
    }
    if (response.answer === undefined || response.answer === null) {
      return res.status(400).json({ message: 'Each response must have an answer' });
    }
  }

  // Validate birth date if provided
  if (birthDate) {
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid birthDate format' });
    }
    // Age must be 18-120
    const age = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (age < 18 || age > 120) {
      return res.status(400).json({ message: 'Age must be between 18 and 120' });
    }
  }

  next();
}

// Validate blood test input ranges
export function validateBloodTests(req: Request, res: Response, next: NextFunction) {
  const { userId, hdl, ldl, cholesterol, glucose } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  // Validate numeric ranges if provided
  const ranges: Record<string, [number, number]> = {
    hdl: [10, 200],
    ldl: [30, 400],
    cholesterol: [50, 500],
    glucose: [30, 600],
  };

  for (const [field, [min, max]] of Object.entries(ranges)) {
    const value = req.body[field];
    if (value !== undefined && value !== null) {
      const num = Number(value);
      if (isNaN(num) || num < min || num > max) {
        return res.status(400).json({
          message: `${field} must be between ${min} and ${max}`,
        });
      }
    }
  }

  next();
}
