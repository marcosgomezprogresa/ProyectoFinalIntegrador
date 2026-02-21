import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe, PaginatedResponse } from '../../models/recipe.model';
import { RecipeDetailComponent } from '../recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RecipeDetailComponent, RecipeFormComponent],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  selectedRecipe: Recipe | null = null;
  editingRecipe: Recipe | null = null;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedCategory = '';
  
  pagination = {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  };

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.loading = true;
    this.errorMessage = null;
    this.selectedCategory = '';
    
    this.recipeService.getAllRecipes(this.pagination.page, this.pagination.limit).subscribe({
      next: (response) => {
        this.recipes = response.data;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar recetas: ' + error.message;
        this.loading = false;
      }
    });
  }

  onCategoryChange() {
    this.pagination.page = 1;
    if (this.selectedCategory) {
      this.loading = true;
      this.errorMessage = null;
      
      this.recipeService.getRecipesByCategory(this.selectedCategory, this.pagination.page, this.pagination.limit).subscribe({
        next: (response) => {
          this.recipes = response.data;
          this.pagination = response.pagination;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al filtrar recetas: ' + error.message;
          this.loading = false;
        }
      });
    } else {
      this.loadRecipes();
    }
  }

  getVeganRecipes() {
    this.pagination.page = 1;
    this.loading = true;
    this.errorMessage = null;
    this.selectedCategory = '';
    
    this.recipeService.getVeganRecipes(this.pagination.page, this.pagination.limit).subscribe({
      next: (response) => {
        this.recipes = response.data;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar recetas veganas: ' + error.message;
        this.loading = false;
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.pagination.pages) {
      this.pagination.page = page;
      if (this.selectedCategory) {
        this.onCategoryChange();
      } else {
        this.loadRecipes();
      }
    }
  }

  viewRecipe(recipe: Recipe) {
    this.selectedRecipe = recipe;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('detailModal'));
    modal.show();
  }

  closeDetailModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('detailModal'));
    if (modal) modal.hide();
  }

  editRecipe(recipe: Recipe) {
    this.editingRecipe = { ...recipe };
    const modal = new (window as any).bootstrap.Modal(document.getElementById('formModal'));
    modal.show();
  }

  toggleFormModal() {
    this.editingRecipe = null;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('formModal'));
    modal.show();
  }

  closeFormModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('formModal'));
    if (modal) modal.hide();
    this.editingRecipe = null;
  }

  onRecipeSaved(message: string) {
    this.successMessage = message;
    this.closeFormModal();
    this.loadRecipes();
    setTimeout(() => this.successMessage = null, 3000);
  }

  deleteRecipe(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      this.recipeService.deleteRecipe(id).subscribe({
        next: () => {
          this.successMessage = '✅ Receta eliminada exitosamente';
          this.loadRecipes();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (error) => {
          this.errorMessage = '❌ Error al eliminar: ' + error.error.message;
        }
      });
    }
  }

  getCategoryLabel(category: string): string {
    const labels: any = {
      appetizer: 'Entrada',
      main: 'Principal',
      dessert: 'Postre',
      beverage: 'Bebida',
      snack: 'Snack'
    };
    return labels[category] || category;
  }

  getCategoryBadgeClass(category: string): string {
    const classes: any = {
      appetizer: 'bg-info',
      main: 'bg-primary',
      dessert: 'bg-danger',
      beverage: 'bg-success',
      snack: 'bg-warning'
    };
    return classes[category] || 'bg-secondary';
  }

  getDifficultyLabel(difficulty: string): string {
    const labels: any = {
      easy: 'Fácil',
      medium: 'Media',
      hard: 'Difícil'
    };
    return labels[difficulty] || difficulty;
  }

  getDifficultyBadgeClass(difficulty: string): string {
    const classes: any = {
      easy: 'bg-success',
      medium: 'bg-warning text-dark',
      hard: 'bg-danger'
    };
    return classes[difficulty] || 'bg-secondary';
  }
}
