import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import requireAuth from '../middleware/requireAuth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Helper to create a 7-day token containing only { id }
function signToken(userId) {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing. Set it in backend/.env.');
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Format user data safely without passwordHash
function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    track: user.track,
    cash: user.cash,
    watchlist: user.watchlist,
  };
}

// POST /api/auth/register
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, track } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash the password with 10 salt rounds
    const passwordHash = await bcrypt.hash(password, 10);

    // New user starts with 10,00,000 cash, empty holdings/positions, and empty watchlist
    const chosenTrack = track === 'pro' ? 'pro' : 'beginner';
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      track: chosenTrack,
      cash: 1000000,
      watchlist: [],
    });

    const token = signToken(user._id);
    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  })
);

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    return res.json({
      token,
      user: sanitizeUser(user),
    });
  })
);

// GET /api/auth/me
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    return res.json({ user: sanitizeUser(req.user) });
  })
);

// PATCH /api/auth/me
router.patch(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { track } = req.body;
    if (track !== 'beginner' && track !== 'pro') {
      return res.status(400).json({ error: 'Track must be beginner or pro' });
    }

    req.user.track = track;
    await req.user.save();

    return res.json({ user: sanitizeUser(req.user) });
  })
);

export default router;
