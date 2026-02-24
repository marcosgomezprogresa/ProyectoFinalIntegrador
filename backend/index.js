require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Importar modelos para registrarlos en Mongoose
require('./src/models/Recipe');

// Importar middleware de base de datos
const { ensureConnection } = require('./src/middlewares/database');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de conexión MongoDB - DEBE estar antes de las rutas
app.use(ensureConnection);

// Rutas DESPUÉS del middleware
const recipeRoutes = require('./src/routes/recipeRoutes');
app.use('/api/v1/recipes', recipeRoutes);

// Documentación de la API - Endpoint raíz - Muestra todas las recetas con paginación
app.get('/', async (req, res) => {
  try {
    const Recipe = mongoose.model('Recipe');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Recipe.countDocuments();
    const recipes = await Recipe.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'API de Gestión de Recetas - MEAN Stack',
      version: '1.0.0',
      baseUrl: 'https://proyectofinalintegradorbackend.vercel.app',
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      availableEndpoints: {
        health: '/api/v1/health',
        recipes: {
          getAll: '/api/v1/recipes/get/all?page=1&limit=10',
          getById: '/api/v1/recipes/get/:id',
          create: '/api/v1/recipes/post',
          update: '/api/v1/recipes/update/:id',
          delete: '/api/v1/recipes/delete/:id',
          filterByCategory: '/api/v1/recipes/category/:category?page=1&limit=10',
          filterVegan: '/api/v1/recipes/filter/vegan?page=1&limit=10'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener recetas: ' + error.message,
    });
  }
});

// Verificación de salud
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'La API está en funcionamiento',
    timestamp: new Date(),
  });
});

// Manejador 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// SOLO si no es Vercel serverless
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n✓ Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`✓ Documentación de la API: http://localhost:${PORT}/api/v1/recipes/documentation\n`);
  });
}

module.exports = app;
