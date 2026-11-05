import mongoose from 'mongoose';

// A stock or index we can trade or show. Prices are demo values until live data in Step 8.
const instrumentSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true },
  sector: { type: String, default: 'Other' },
  price: { type: Number, required: true, min: 0 },
  prevClose: { type: Number, required: true, min: 0 },
  isIndex: { type: Boolean, default: false },
});

export default mongoose.model('Instrument', instrumentSchema);
