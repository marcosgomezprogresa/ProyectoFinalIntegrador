const Recipe = require('../models/Recipe'); //pillo el schema

// OBTENER todas las recetas con paginación
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

// OBTENER receta por ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Receta no encontrada',
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

// CREAR nueva receta
exports.createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, preparationTime, servings, difficulty, category, isVegan, isGlutenFree, rating } = req.body;

    // Lógica de Negocio: Validar que el título no exista
    const existingRecipe = await Recipe.findOne({ title });
    if (existingRecipe) {
      return res.status(400).json({
        success: false,
        message: 'Una receta con este título ya existe',
      });
    }

    // Lógica de Negocio: Validar tiempo de preparación
    if (preparationTime && (preparationTime < 1 || preparationTime > 1000)) {
      return res.status(400).json({
        success: false,
        message: 'El tiempo de preparación debe estar entre 1 y 1000 minutos',
      });
    }

    // Lógica de Negocio: Validar rango de calificación
    if (rating && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'La calificación debe estar entre 0 y 5',
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
      message: 'Receta creada exitosamente',
      data: recipe,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ACTUALIZAR receta
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, ingredients, preparationTime, servings, difficulty, category, isVegan, isGlutenFree, rating } = req.body;

    // Verificar si la receta existe
    let recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Receta no encontrada',
      });
    }

    // Lógica de Negocio: Si se está actualizando el título, verificar duplicados
    if (title && title !== recipe.title) {
      const existingRecipe = await Recipe.findOne({ title });
      if (existingRecipe) {
        return res.status(400).json({
          success: false,
          message: 'Una receta con este título ya existe',
        });
      }
    }

    // Lógica de Negocio: Validar tiempo de preparación
    if (preparationTime && (preparationTime < 1 || preparationTime > 1000)) {
      return res.status(400).json({
        success: false,
        message: 'El tiempo de preparación debe estar entre 1 y 1000 minutos',
      });
    }

    // Lógica de Negocio: Validar rango de calificación
    if (rating && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'La calificación debe estar entre 0 y 5',
      });
    }

    recipe = await Recipe.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Receta actualizada exitosamente',
      data: recipe,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ELIMINAR receta
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Receta no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Receta eliminada exitosamente',
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// OBTENER recetas por categoría (filtro)
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

// OBTENER recetas veganas
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

// OBTENER Documentación
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
