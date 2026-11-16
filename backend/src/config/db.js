const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is missing. Add it to backend/.env (see .env.example).');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected (${mongoose.connection.name})`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error('Check the URI, the database user password, and that Atlas Network Access allows your IP.');
    process.exit(1);
  }
}

module.exports = connectDB;
