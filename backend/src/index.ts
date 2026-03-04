import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import responsesRouter from './routes/responses';
import predictionsRouter from './routes/predictions';
import bloodTestsRouter from './routes/bloodTests';
import { validateResponses, validateBloodTests } from './middleware/validation';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/responses', validateResponses, responsesRouter);
app.use('/api/predict', validateResponses, predictionsRouter);
app.use('/api/prediction', predictionsRouter);
app.use('/api/blood-tests', validateBloodTests, bloodTestsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Death Clock API running on port ${PORT}`);
});

export default app;
