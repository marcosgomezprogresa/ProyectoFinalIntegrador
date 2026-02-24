const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Documentación
router.get('/documentation', recipeController.getDocumentation);

// Rutas CRUD
router.get('/get/all', recipeController.getAllRecipes);
router.get('/get/:id', recipeController.getRecipeById);
router.post('/post', recipeController.createRecipe);
router.patch('/update/:id', recipeController.updateRecipe);
router.delete('/delete/:id', recipeController.deleteRecipe);

// Rutas de filtrado
router.get('/category/:category', recipeController.getRecipesByCategory);
router.get('/filter/vegan', recipeController.getVeganRecipes);

module.exports = router;

// Probar en internet las rutas 
// 
// ✅ Obtener todas las recetas pero paginadas:
// https://proyectofinalintegradorbackend.vercel.app/api/v1/recipes/get/all?page=1&limit=10
// 
// ✅ Obtener receta por ID 
// https://proyectofinalintegradorbackend.vercel.app/api/v1/recipes/get/699c62f2159cb2101fbc8723
// 
// ✅ Filtrar por categoría:
// https://proyectofinalintegradorbackend.vercel.app/api/v1/recipes/category/principal?page=1&limit=10
// https://proyectofinalintegradorbackend.vercel.app/api/v1/recipes/category/postre
// 
// ✅ Filtrar recetas veganas:
// https://proyectofinalintegradorbackend.vercel.app/api/v1/recipes/filter/vegan?page=1&limit=10
// 
// ESTAS EM POSTMAN
// POST   https://proyectofinalintegradorbackend.vercel.app/api/v1/recipes/post
// PATCH  https://proyectofinalintegradorbackend.vercel.app/api/v1/recipes/update/699c62f2159cb2101fbc8723
// DELETE https://proyectofinalintegradorbackend.vercel.app/api/v1/recipes/delete/699c62f2159cb2101fbc8723
