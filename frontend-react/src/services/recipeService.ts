import { Recipe, PaginationResponse, ApiResponse } from '../types/Recipe';

const API_URL = 'https://proyectofinalintegradorbackend.vercel.app/api/v1/recipes';

export const recipeService = {
  // Obtener todas las recetas con paginación
  async getAllRecipes(page: number = 1, limit: number = 10): Promise<PaginationResponse> {
    const response = await fetch(`${API_URL}/get/all?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Error al cargar recetas');
    return response.json();
  },

  // Obtener receta por ID
  async getRecipeById(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/get/${id}`);
    if (!response.ok) throw new Error('Error al cargar receta');
    return response.json();
  },

  // Crear nueva receta
  async createRecipe(recipe: Partial<Recipe>): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear receta');
    }
    return response.json();
  },

  // Actualizar receta
  async updateRecipe(id: string, recipe: Partial<Recipe>): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar receta');
    }
    return response.json();
  },

  // Eliminar receta
  async deleteRecipe(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar receta');
    }
    return response.json();
  },

  // Obtener recetas por categoría
  async getRecipesByCategory(category: string, page: number = 1, limit: number = 10): Promise<PaginationResponse> {
    const response = await fetch(`${API_URL}/category/${category}?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Error al filtrar recetas');
    return response.json();
  },

  // Obtener recetas veganas
  async getVeganRecipes(page: number = 1, limit: number = 10): Promise<PaginationResponse> {
    const response = await fetch(`${API_URL}/filter/vegan?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Error al cargar recetas veganas');
    return response.json();
  }
};
