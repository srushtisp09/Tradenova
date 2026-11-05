import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { buildPortfolio } from '../services/portfolio.js';
import PortfolioSnapshot from '../models/PortfolioSnapshot.js';

const router = Router();

// GET /api/portfolio -> totals + upsert today's snapshot
router.get('/', asyncHandler(async (req, res) => {
  const portfolio = await buildPortfolio(req.user);
  const netWorth = portfolio.totals.netWorth;

  // Format today's date as YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);

  // Upsert today's snapshot for the user
  PortfolioSnapshot.findOneAndUpdate(
    { user: req.user._id, date: today },
    { $set: { netWorth } },
    { upsert: true, new: true }
  ).catch((err) => {
    console.warn('[portfolio] Snapshot upsert failed:', err.message);
  });

  res.json(portfolio.totals);
}));

// GET /api/portfolio/history -> last 30 snapshots, oldest first
router.get('/history', asyncHandler(async (req, res) => {
  const snapshots = await PortfolioSnapshot.find({ user: req.user._id })
    .sort({ date: -1 })
    .limit(30)
    .lean();

  // Return oldest first
  snapshots.reverse();
  res.json(snapshots);
}));

router.get('/holdings', asyncHandler(async (req, res) => res.json((await buildPortfolio(req.user)).holdings)));
router.get('/positions', asyncHandler(async (req, res) => res.json((await buildPortfolio(req.user)).positions)));

export default router;
