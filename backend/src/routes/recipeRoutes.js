const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Documentation
router.get('/documentation', recipeController.getDocumentation);

// CRUD routes
router.get('/get/all', recipeController.getAllRecipes);
router.get('/get/:id', recipeController.getRecipeById);
router.post('/post', recipeController.createRecipe);
router.patch('/update/:id', recipeController.updateRecipe);
router.delete('/delete/:id', recipeController.deleteRecipe);

// Filter routes
router.get('/category/:category', recipeController.getRecipesByCategory);
router.get('/filter/vegan', recipeController.getVeganRecipes);

module.exports = router;
