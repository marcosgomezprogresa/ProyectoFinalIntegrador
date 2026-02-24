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
