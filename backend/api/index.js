const mongoose = require('mongoose');
const app = require('../app');

// Connection handler for serverless
const connectDB = async () => {
  // If already connected, return
  if (mongoose.connections[0].readyState === 1) {
    return;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI not configured');
  }

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
  });
};

// Middleware to ensure connection before each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB connection error:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

module.exports = app;
