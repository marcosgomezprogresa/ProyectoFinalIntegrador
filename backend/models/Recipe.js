const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: [3, 'El título debe tener al menos 3 caracteres'],
      maxlength: [100, 'El título no puede exceder 100 caracteres'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    },
    ingredients: {
      type: String,
      required: [true, 'Los ingredientes son obligatorios'],
    },
    preparationTime: {
      type: Number,
      required: [true, 'El tiempo de preparación es obligatorio'],
      min: [1, 'El tiempo de preparación debe ser al menos 1 minuto'],
    },
    servings: {
      type: Number,
      required: [true, 'Las porciones son obligatorias'],
      min: [1, 'Las porciones deben ser al menos 1'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: ['entrante', 'principal', 'postre', 'bebida', 'refrigerio'],
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/300x300?text=Receta',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware para actualizar updatedAt
recipeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Recipe', recipeSchema);
