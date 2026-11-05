import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// Until login exists (Step 7), every request acts as the demo user.
// In Step 7 this file is replaced by a middleware that reads the user from a JWT token.
export const DEMO_EMAIL = 'demo@tradenova.dev';

export default asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: DEMO_EMAIL });
  if (!user) return res.status(404).json({ error: 'Demo user not found. In the backend folder run: npm run seed' });
  req.user = user;
  next();
});
