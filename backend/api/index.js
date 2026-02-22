const mongoose = require('mongoose');
const app = require('../app');

let mongoConnection = null;

const connectDB = async () => {
  // If connection exists and is ready, return it
  if (mongoConnection && mongoose.connection.readyState === 1) {
    return mongoConnection;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI not configured');
  }

  try {
    mongoConnection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 10000,
      retryWrites: true,
    });

    return mongoConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    mongoConnection = null;
    throw error;
  }
};

// Middleware to ensure connection before each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Database connection timeout - ' + error.message,
    });
  }
});

module.exports = app;
