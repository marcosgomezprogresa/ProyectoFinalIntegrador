const mongoose = require('mongoose');
const app = require('../app');

let isConnected = false;

// Connect to MongoDB
const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Already connected to MongoDB');
    return;
  }

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    console.log('✅ Mongoose already connected');
    return;
  }
  
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('❌ MONGODB_URI env var is not defined');
  }

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    throw error;
  }
};

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

module.exports = app;
