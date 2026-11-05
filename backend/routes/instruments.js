import { Router } from 'express';
import Instrument from '../models/Instrument.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const router = Router();

// GET /api/instruments  -> every stock and index
router.get('/', asyncHandler(async (req, res) => {
  res.json(await Instrument.find().sort({ isIndex: 1, symbol: 1 }).lean());
}));

// GET /api/instruments/TCS  -> one stock
router.get('/:symbol', asyncHandler(async (req, res) => {
  const item = await Instrument.findOne({ symbol: req.params.symbol.toUpperCase() }).lean();
  if (!item) throw new HttpError(404, 'Unknown symbol');
  res.json(item);
}));

export default router;
