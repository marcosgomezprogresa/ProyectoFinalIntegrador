import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="mb-3">
        <label class="form-label">Título *</label>
        <input type="text" class="form-control" formControlName="title" required>
        <div class="form-text text-danger" *ngIf="form.get('title')?.hasError('required') && form.get('title')?.touched">
          El título es requerido
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Descripción *</label>
        <textarea class="form-control" formControlName="description" rows="2" required></textarea>
        <div class="form-text text-danger" *ngIf="form.get('description')?.hasError('required') && form.get('description')?.touched">
          La descripción es requerida (mín. 10 caracteres)
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Ingredientes *</label>
        <textarea class="form-control" formControlName="ingredients" rows="2" required></textarea>
        <div class="form-text text-danger" *ngIf="form.get('ingredients')?.hasError('required') && form.get('ingredients')?.touched">
          Los ingredientes son requeridos
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Tiempo de Preparación (min) *</label>
            <input type="number" class="form-control" formControlName="preparationTime" min="1" max="1000" required>
            <div class="form-text text-danger" *ngIf="form.get('preparationTime')?.hasError('required') && form.get('preparationTime')?.touched">
              Tiempo requerido (1-1000 min)
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Porciones *</label>
            <input type="number" class="form-control" formControlName="servings" min="1" required>
            <div class="form-text text-danger" *ngIf="form.get('servings')?.hasError('required') && form.get('servings')?.touched">
              Porciones requeridas
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Dificultad *</label>
            <select class="form-select" formControlName="difficulty" required>
              <option value="">Seleccionar</option>
              <option value="easy">Fácil</option>
              <option value="medium">Media</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Categoría *</label>
            <select class="form-select" formControlName="category" required>
              <option value="">Seleccionar</option>
              <option value="appetizer">Entrada</option>
              <option value="main">Plato Principal</option>
              <option value="dessert">Postre</option>
              <option value="beverage">Bebida</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Rating (0-5)</label>
            <input type="number" class="form-control" formControlName="rating" min="0" max="5" step="0.1">
          </div>
        </div>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" formControlName="isVegan" id="isVegan">
        <label class="form-check-label" for="isVegan">
          Es Vegana 🌱
        </label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" formControlName="isGlutenFree" id="isGlutenFree">
        <label class="form-check-label" for="isGlutenFree">
          Sin Gluten 🌾
        </label>
      </div>

      <div *ngIf="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" [disabled]="!form.valid || loading">
          <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isEditMode ? 'Actualizar' : 'Crear' }}
        </button>
        <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
      </div>
    </form>
  `,
  styles: []
})
export class RecipeFormComponent implements OnInit {
  @Input() recipe: Recipe | null = null;
  @Output() saved = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  isEditMode = false;

  constructor(private fb: FormBuilder, private recipeService: RecipeService) {
    this.initializeForm();
  }

  ngOnInit() {
    if (this.recipe) {
      this.isEditMode = true;
      this.form.patchValue(this.recipe);
    }
  }

  private initializeForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      ingredients: ['', Validators.required],
      preparationTime: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      servings: ['', [Validators.required, Validators.min(1)]],
      difficulty: ['medium', Validators.required],
      category: ['', Validators.required],
      isVegan: [false],
      isGlutenFree: [false],
      rating: [0, [Validators.min(0), Validators.max(5)]]
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    if (this.isEditMode && this.recipe) {
      this.recipeService.updateRecipe(this.recipe._id!, this.form.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.saved.emit('✅ Receta actualizada exitosamente');
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = '❌ Error: ' + (error.error.message || error.message);
        }
      });
    } else {
      this.recipeService.createRecipe(this.form.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.saved.emit('✅ Receta creada exitosamente');
          this.form.reset();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = '❌ Error: ' + (error.error.message || error.message);
        }
      });
    }
  }

  onCancel() {
    this.closed.emit();
  }
}
