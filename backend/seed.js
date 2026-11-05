import 'dotenv/config';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';
import User from './models/User.js';
import Instrument from './models/Instrument.js';
import Holding from './models/Holding.js';
import Position from './models/Position.js';
import Order from './models/Order.js';
import { DEMO_EMAIL } from './middleware/demoUser.js';
import { instruments, holdings, positions, watchlist, startingCash } from './data/seedData.js';

// Fills the database with demo data. Safe to run again: it rebuilds only the demo user and the market data.
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is missing. Add it to backend/.env first.');
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGO_URI);

  await Instrument.deleteMany({});
  await Instrument.insertMany(instruments);

  const old = await User.findOne({ email: DEMO_EMAIL });
  if (old) {
    await Promise.all([Holding.deleteMany({ user: old._id }), Position.deleteMany({ user: old._id }), Order.deleteMany({ user: old._id })]);
    await old.deleteOne();
  }

  const invested = holdings.reduce((s, h) => s + h.qty * h.avgPrice, 0);
  const user = await User.create({ name: 'Demo Trader', email: DEMO_EMAIL, track: 'pro', cash: startingCash - invested, watchlist });
  await Holding.insertMany(holdings.map((h) => ({ ...h, user: user._id })));
  await Position.insertMany(positions.map((p) => ({ ...p, user: user._id })));

  console.log(`Seeded: ${instruments.length} instruments, 1 demo user, ${holdings.length} holdings, ${positions.length} positions.`);
} catch (err) {
  console.error('Seed failed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
