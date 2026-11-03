import mongoose from 'mongoose';

// Connects to MongoDB. If MONGO_URI is missing the server still runs, so you can work on other things.
export default async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI is not set. Running without a database.');
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
  }
}
