export interface Recipe {
  _id?: string;
  title: string;
  description: string;
  ingredients: string;
  preparationTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'entrante' | 'principal' | 'postre' | 'bebida' | 'refrigerio';
  isVegan: boolean;
  isGlutenFree: boolean;
  rating: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationResponse {
  data: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: Recipe;
  error?: string;
}
