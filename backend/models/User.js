import mongoose from 'mongoose';

// A person using TradeNova. Login (passwordHash) is added in Step 7.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    track: { type: String, enum: ['beginner', 'pro'], default: 'beginner' },
    cash: { type: Number, default: 1000000 }, // virtual rupees
    watchlist: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
