import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'fallback_secret_tradenova',
    { expiresIn: '7d' }
  );
}

// POST /api/auth/signup
router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { name, email, password, track } = req.body;

    if (!name || !name.trim()) throw new HttpError(400, 'Name is required.');
    if (!email || !email.includes('@')) throw new HttpError(400, 'Valid email is required.');
    if (!password || password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters.');

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) throw new HttpError(409, 'An account with this email already exists.');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      track: track === 'pro' ? 'pro' : 'beginner',
      cash: 1000000,
      watchlist: ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK'],
    });

    const token = createToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        track: user.track,
        cash: user.cash,
      },
    });
  })
);

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) throw new HttpError(400, 'Email and password are required.');

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.passwordHash) {
      throw new HttpError(401, 'Invalid email or password.');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new HttpError(401, 'Invalid email or password.');
    }

    const token = createToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        track: user.track,
        cash: user.cash,
      },
    });
  })
);

// GET /api/auth/me
router.get(
  '/me',
  auth,
  asyncHandler(async (req, res) => {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        track: req.user.track,
        cash: req.user.cash,
      },
    });
  })
);

export default router;
