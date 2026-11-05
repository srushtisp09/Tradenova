import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { buildPortfolio } from '../services/portfolio.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => res.json((await buildPortfolio(req.user)).totals)));
router.get('/holdings', asyncHandler(async (req, res) => res.json((await buildPortfolio(req.user)).holdings)));
router.get('/positions', asyncHandler(async (req, res) => res.json((await buildPortfolio(req.user)).positions)));

export default router;
