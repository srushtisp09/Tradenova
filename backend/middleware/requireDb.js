import mongoose from 'mongoose';

// Stops API calls with a clear message if MongoDB is not connected.
export default function requireDb(req, res, next) {
  if (mongoose.connection.readyState === 1) return next();
  res.status(503).json({ error: 'Database not connected. Check MONGO_URI in backend/.env' });
}
