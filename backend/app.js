const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const recipeRoutes = require('./src/routes/recipeRoutes');
app.use('/api/v1/recipes', recipeRoutes);

// API Documentation - Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Recipe Management API - MEAN Stack',
    version: '1.0.0',
    baseUrl: 'https://proyectofinalintegradorbackend.vercel.app',
    endpoints: {
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
    },
    documentation: 'See GitHub repository for full documentation'
  });
});

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

module.exports = app;
