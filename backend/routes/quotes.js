import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { fetchQuotes, getHistory } from '../services/marketData.js';
import { HttpError } from '../utils/httpError.js';

const router = Router();

// GET /api/quotes -> public live / simulated quotes
router.get('/', asyncHandler(async (req, res) => {
  const result = await fetchQuotes();
  res.json(result);
}));

export default router;
