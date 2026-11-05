import { Router } from 'express';
import Instrument from '../models/Instrument.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { getHistory } from '../services/marketData.js';

const router = Router();

// GET /api/instruments  -> every stock and index
router.get('/', asyncHandler(async (req, res) => {
  res.json(await Instrument.find().sort({ isIndex: 1, symbol: 1 }).lean());
}));

// GET /api/instruments/:symbol/history?range=1mo -> historical candle quotes
const VALID_RANGES = new Set(['1d', '5d', '1mo', '6mo', '1y']);
router.get('/:symbol/history', asyncHandler(async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const range = (req.query.range || '1mo').toLowerCase();

  if (!VALID_RANGES.has(range)) {
    throw new HttpError(400, `Invalid range. Choose one of: ${Array.from(VALID_RANGES).join(', ')}`);
  }

  const history = await getHistory(symbol, range);
  res.json(history);
}));

// GET /api/instruments/TCS  -> one stock
router.get('/:symbol', asyncHandler(async (req, res) => {
  const item = await Instrument.findOne({ symbol: req.params.symbol.toUpperCase() }).lean();
  if (!item) throw new HttpError(404, 'Unknown symbol');
  res.json(item);
}));

export default router;
