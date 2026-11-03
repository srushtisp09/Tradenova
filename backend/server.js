import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Health check: open http://localhost:5000/api/health to confirm the server runs.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'TradeNova API' });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
