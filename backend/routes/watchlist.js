import { Router } from 'express';
import User from '../models/User.js';
import Instrument from '../models/Instrument.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const router = Router();

// GET /api/watchlist -> the user's stocks with prices, in the order they were added
router.get('/', asyncHandler(async (req, res) => {
  const items = await Instrument.find({ symbol: { $in: req.user.watchlist } }).lean();
  const bySymbol = Object.fromEntries(items.map((i) => [i.symbol, i]));
  res.json(req.user.watchlist.map((s) => bySymbol[s]).filter(Boolean));
}));

// POST /api/watchlist  { "symbol": "ITC" }
router.post('/', asyncHandler(async (req, res) => {
  const symbol = String(req.body.symbol || '').toUpperCase().trim();
  const found = await Instrument.findOne({ symbol, isIndex: false });
  if (!found) throw new HttpError(404, 'Unknown symbol');
  await User.updateOne({ _id: req.user._id }, { $addToSet: { watchlist: symbol } }); // no duplicates
  res.status(201).json({ symbol });
}));

// DELETE /api/watchlist/ITC
router.delete('/:symbol', asyncHandler(async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  await User.updateOne({ _id: req.user._id }, { $pull: { watchlist: symbol } });
  res.json({ symbol });
}));

export default router;
