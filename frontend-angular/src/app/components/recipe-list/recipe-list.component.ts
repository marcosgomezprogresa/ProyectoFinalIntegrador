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
  template: `
    <div class="row">
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Filtros</h5>
            <div class="mb-3">
              <label class="form-label">Categoría</label>
              <select class="form-select" [(ngModel)]="selectedCategory" (change)="onCategoryChange()">
                <option value="">Todas</option>
                <option value="appetizer">Entrada</option>
                <option value="main">Plato Principal</option>
                <option value="dessert">Postre</option>
                <option value="beverage">Bebida</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <button class="btn btn-warning w-100 mb-2" (click)="getVeganRecipes()">
              🌱 Veganas
            </button>
            <button class="btn btn-info w-100" (click)="loadRecipes()">
              Todas
            </button>
          </div>
        </div>

        <div class="card mt-3">
          <div class="card-body">
            <h5 class="card-title">Crear Receta</h5>
            <button class="btn btn-success w-100" (click)="toggleFormModal()">
              + Nueva Receta
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <!-- Loading -->
        <div *ngIf="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <!-- Error Alert -->
        <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
          {{ errorMessage }}
          <button type="button" class="btn-close" (click)="errorMessage = null"></button>
        </div>

        <!-- Success Alert -->
        <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
          {{ successMessage }}
          <button type="button" class="btn-close" (click)="successMessage = null"></button>
        </div>

        <!-- Recipes Table -->
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Recetas ({{pagination.total}} total)</h5>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Categoría</th>
                    <th>Tiempo (min)</th>
                    <th>Dificultad</th>
                    <th>Rating</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let recipe of recipes">
                    <td>{{ recipe.title }}</td>
                    <td>
                      <span class="badge" [ngClass]="getCategoryBadgeClass(recipe.category)">
                        {{ getCategoryLabel(recipe.category) }}
                      </span>
                    </td>
                    <td>{{ recipe.preparationTime }}</td>
                    <td>
                      <span class="badge" [ngClass]="getDifficultyBadgeClass(recipe.difficulty)">
                        {{ getDifficultyLabel(recipe.difficulty) }}
                      </span>
                    </td>
                    <td>⭐ {{ recipe.rating }}</td>
                    <td>
                      <button class="btn btn-sm btn-primary" (click)="viewRecipe(recipe)">Ver</button>
                      <button class="btn btn-sm btn-warning ms-1" (click)="editRecipe(recipe)">Editar</button>
                      <button class="btn btn-sm btn-danger ms-1" (click)="deleteRecipe(recipe._id!)">Eliminar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <nav>
              <ul class="pagination justify-content-center">
                <li class="page-item" [class.disabled]="pagination.page <= 1">
                  <button class="page-link" (click)="goToPage(pagination.page - 1)" [disabled]="pagination.page <= 1">
                    Anterior
                  </button>
                </li>
                <li class="page-item active">
                  <span class="page-link">Página {{ pagination.page }} de {{ pagination.pages }}</span>
                </li>
                <li class="page-item" [class.disabled]="pagination.page >= pagination.pages">
                  <button class="page-link" (click)="goToPage(pagination.page + 1)" [disabled]="pagination.page >= pagination.pages">
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Detail Modal -->
    <div class="modal fade" id="detailModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles de Receta</h5>
            <button type="button" class="btn-close" (click)="closeDetailModal()"></button>
          </div>
          <div class="modal-body">
            <app-recipe-detail *ngIf="selectedRecipe" [recipe]="selectedRecipe"></app-recipe-detail>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Form Modal -->
    <div class="modal fade" id="formModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingRecipe ? 'Editar Receta' : 'Nueva Receta' }}</h5>
            <button type="button" class="btn-close" (click)="closeFormModal()"></button>
          </div>
          <div class="modal-body">
            <app-recipe-form 
              [recipe]="editingRecipe" 
              (saved)="onRecipeSaved($event)"
              (closed)="closeFormModal()">
            </app-recipe-form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-hover tbody tr:hover {
      background-color: #f5f5f5;
    }
  `]
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
