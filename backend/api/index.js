const mongoose = require('mongoose');
const app = require('../app');

// MongoDB connection handler
async function ensureDBConnected() {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Wrap all requests with DB connection
app.use(async (req, res, next) => {
  try {
    await ensureDBConnected();
    next();
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: error.message,
    });
  }
});

// Graceful shutdown handler
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState >= 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
});

module.exports = app;
