import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// Checks the Bearer token in the Authorization header.
// Attaches req.user if valid, otherwise returns 401.
export default asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Please log in' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Please log in' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing. Set it in backend/.env.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'Please log in' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Please log in' });
  }
});
