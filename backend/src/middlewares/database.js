const mongoose = require('mongoose');

// Caché de conexión para Vercel serverless
let cachedConnection = null;

/**
 * Middleware de conexión a MongoDB
 * Reutiliza la conexión existente si está disponible (importante para serverless)
 * Reutilizar la conexión
 */
const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI no configurada en las variables de entorno');
  }

  try {
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 60000,
    });
    
    cachedConnection = connection;
    console.log('✓ Conectado a MongoDB');
    return connection;
  } catch (error) {
    console.error('✗ Error de conexión a MongoDB:', error.message);
    throw error;
  }
};

/**
 * Middleware Express para asegurar conexión en cada petición
 */
const ensureConnection = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error de conexión a la base de datos: ' + error.message,
    });
  }
};

module.exports = { connectDB, ensureConnection };
