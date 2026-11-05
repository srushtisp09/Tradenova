import mongoose from 'mongoose';

// Trades opened today (intraday).
const positionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true, uppercase: true },
  product: { type: String, enum: ['MIS', 'CNC'], default: 'MIS' },
  qty: { type: Number, required: true },
  avgPrice: { type: Number, required: true, min: 0 },
});

export default mongoose.model('Position', positionSchema);
