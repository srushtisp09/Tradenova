import mongoose from 'mongoose';

// Daily snapshot of user net worth for the growth chart
const portfolioSnapshotSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  netWorth: { type: Number, required: true },
}, { timestamps: true });

// Ensure one snapshot per user per day
portfolioSnapshotSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('PortfolioSnapshot', portfolioSnapshotSchema);
