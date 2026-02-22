const mongoose = require('mongoose');
const app = require('../app');

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined');
  }

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Connect before exporting
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

module.exports = app;
