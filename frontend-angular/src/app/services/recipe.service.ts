import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe, PaginatedResponse, ApiResponse } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/api/v1/recipes';

  constructor(private http: HttpClient) { }

 
  getAllRecipes(page: number = 1, limit: number = 10): Observable<PaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse>(`${this.apiUrl}/get/all`, { params });
  }

  
  getRecipeById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/get/${id}`);
  }

  
  createRecipe(recipe: Recipe): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/post`, recipe);
  }

  
  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/update/${id}`, recipe);
  }

  
  deleteRecipe(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/delete/${id}`);
  }

  
  getRecipesByCategory(category: string, page: number = 1, limit: number = 10): Observable<PaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse>(`${this.apiUrl}/category/${category}`, { params });
  }

  
  getVeganRecipes(page: number = 1, limit: number = 10): Observable<PaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse>(`${this.apiUrl}/filter/vegan`, { params });
  }
}
