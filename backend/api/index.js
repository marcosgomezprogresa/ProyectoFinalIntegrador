const mongoose = require('mongoose');

// Import models to register them with Mongoose
require('../src/models/Recipe');

const app = require('../app');

let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if exists and active
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI not configured');
  }

  try {
    console.log('Connecting to MongoDB...');
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 15000,
      retryWrites: true,
    });

    cachedConnection = connection;
    console.log('✓ MongoDB connected');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

// Middleware to ensure connection before each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    res.status(500).json({
      success: false,
      message: 'Database connection error: ' + error.message,
    });
  }
});

module.exports = app;
