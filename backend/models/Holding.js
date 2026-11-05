import mongoose from 'mongoose';

// Shares a user owns for the long term.
const holdingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true, uppercase: true },
  qty: { type: Number, required: true, min: 0 },
  avgPrice: { type: Number, required: true, min: 0 },
});
holdingSchema.index({ user: 1, symbol: 1 }, { unique: true }); // one row per user per stock

export default mongoose.model('Holding', holdingSchema);
