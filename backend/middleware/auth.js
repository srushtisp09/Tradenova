import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { DEMO_EMAIL } from './demoUser.js';

// Authenticates user via JWT Bearer token.
// If no token is provided, gracefully falls back to the demo user so paper trading remains accessible.
export default asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_tradenova');
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (err) {
      return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
    }
  }

  // Fallback to demo user
  const demo = await User.findOne({ email: DEMO_EMAIL });
  if (demo) {
    req.user = demo;
    return next();
  }

  return res.status(401).json({ error: 'Authentication required.' });
});
