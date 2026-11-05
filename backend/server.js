import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import requireDb from './middleware/requireDb.js';
import auth from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import instrumentRoutes from './routes/instruments.js';
import portfolioRoutes from './routes/portfolio.js';
import watchlistRoutes from './routes/watchlist.js';
import orderRoutes from './routes/orders.js';

const app = express();
app.use(cors()); // open for development. We restrict it when we deploy.
app.use(express.json());

// Health check works even without a database.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'TradeNova API', db: mongoose.connection.readyState === 1 ? 'connected' : 'not connected' });
});

app.use('/api', requireDb); // everything below needs the database
app.use('/api/auth', authRoutes);
app.use('/api/instruments', instrumentRoutes);
app.use('/api/portfolio', auth, portfolioRoutes);
app.use('/api/watchlist', auth, watchlistRoutes);
app.use('/api/orders', auth, orderRoutes);
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
