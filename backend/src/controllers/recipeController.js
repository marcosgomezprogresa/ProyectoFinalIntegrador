const Recipe = require('../models/Recipe');

// GET all recipes with pagination
exports.getAllRecipes = async (req, res) => {
  try {
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
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE new recipe
exports.createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, preparationTime, servings, difficulty, category, isVegan, isGlutenFree, rating } = req.body;

    // Business Logic: Validate title doesn't exist
    const existingRecipe = await Recipe.findOne({ title });
    if (existingRecipe) {
      return res.status(400).json({
        success: false,
        message: 'A recipe with this title already exists',
      });
    }

    // Business Logic: Validate preparation time
    if (preparationTime < 1 || preparationTime > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Preparation time must be between 1 and 1000 minutes',
      });
    }

    // Business Logic: Validate rating range
    if (rating && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5',
      });
    }

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      preparationTime,
      servings,
      difficulty,
      category,
      isVegan,
      isGlutenFree,
      rating,
    });

    await recipe.save();

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: recipe,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE recipe
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, ingredients, preparationTime, servings, difficulty, category, isVegan, isGlutenFree, rating } = req.body;

    // Check if recipe exists
    let recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    // Business Logic: If title is being updated, check for duplicates
    if (title && title !== recipe.title) {
      const existingRecipe = await Recipe.findOne({ title });
      if (existingRecipe) {
        return res.status(400).json({
          success: false,
          message: 'A recipe with this title already exists',
        });
      }
    }

    // Business Logic: Validate preparation time
    if (preparationTime && (preparationTime < 1 || preparationTime > 1000)) {
      return res.status(400).json({
        success: false,
        message: 'Preparation time must be between 1 and 1000 minutes',
      });
    }

    // Business Logic: Validate rating range
    if (rating && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5',
      });
    }

    recipe = await Recipe.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      data: recipe,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully',
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET recipes by category (filter)
exports.getRecipesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Recipe.countDocuments({ category });
    const recipes = await Recipe.find({ category })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET vegan recipes
exports.getVeganRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Recipe.countDocuments({ isVegan: true });
    const recipes = await Recipe.find({ isVegan: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET Documentation
exports.getDocumentation = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Gestión de Recetas - Documentación',
    version: '1.0.0',
    endpoints: {
      documentation: 'GET /api/v1/documentation',
      recipes: {
        getAll: 'GET /api/v1/recipes/get/all?page=1&limit=10',
        getById: 'GET /api/v1/recipes/get/:id',
        create: 'POST /api/v1/recipes/post',
        update: 'PATCH /api/v1/recipes/update/:id',
        delete: 'DELETE /api/v1/recipes/delete/:id',
        getByCategory: 'GET /api/v1/recipes/category/:category?page=1&limit=10',
        getVegan: 'GET /api/v1/recipes/filter/vegan?page=1&limit=10',
      },
      categories: ['entrante', 'principal', 'postre', 'bebida', 'refrigerio'],
      difficulties: ['easy', 'medium', 'hard'],
    },
  });
};
