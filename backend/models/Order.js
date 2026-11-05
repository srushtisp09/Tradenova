import mongoose from 'mongoose';

// A buy or sell request. Step 9 turns OPEN orders into EXECUTED ones.
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    symbol: { type: String, required: true, uppercase: true },
    side: { type: String, enum: ['BUY', 'SELL'], required: true },
    type: { type: String, enum: ['MARKET', 'LIMIT'], default: 'MARKET' },
    product: { type: String, enum: ['CNC', 'MIS'], default: 'CNC' },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, min: 0 }, // only for LIMIT orders
    status: { type: String, enum: ['OPEN', 'EXECUTED', 'CANCELLED'], default: 'OPEN' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
