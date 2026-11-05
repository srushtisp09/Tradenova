import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import requireDb from './middleware/requireDb.js';
import requireAuth from './middleware/requireAuth.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import instrumentRoutes from './routes/instruments.js';
import quotesRoutes from './routes/quotes.js';
import portfolioRoutes from './routes/portfolio.js';
import watchlistRoutes from './routes/watchlist.js';
import orderRoutes from './routes/orders.js';

// JWT_SECRET is required for auth. Check early to fail fast.
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not defined.');
}

const app = express();
app.use(cors());
app.use(express.json());

// Public health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'TradeNova API',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'not connected',
  });
});

app.use('/api', requireDb);

// Public instruments catalog & quotes
app.use('/api/instruments', instrumentRoutes);
app.use('/api/quotes', quotesRoutes);

// Auth routes (register and login are public, me endpoints use requireAuth inside)
app.use('/api/auth', authRoutes);

// Protected user routes
app.use('/api/portfolio', requireAuth, portfolioRoutes);
app.use('/api/watchlist', requireAuth, watchlistRoutes);
app.use('/api/orders', requireAuth, orderRoutes);

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
