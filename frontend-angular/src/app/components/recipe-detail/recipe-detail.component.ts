import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="recipe">
      <div class="mb-3">
        <h6 class="text-muted">Título</h6>
        <p class="h5">{{ recipe.title }}</p>
      </div>

      <div class="mb-3">
        <h6 class="text-muted">Descripción</h6>
        <p>{{ recipe.description }}</p>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <h6 class="text-muted">Tiempo de Preparación</h6>
            <p>⏱️ {{ recipe.preparationTime }} minutos</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <h6 class="text-muted">Porciones</h6>
            <p>🍽️ {{ recipe.servings }} porciones</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <h6 class="text-muted">Dificultad</h6>
            <p>
              <span class="badge" [ngClass]="getDifficultyClass()">
                {{ recipe.difficulty | uppercase }}
              </span>
            </p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <h6 class="text-muted">Categoría</h6>
            <p>
              <span class="badge bg-primary">{{ recipe.category }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <h6 class="text-muted">Ingredientes</h6>
        <p>{{ recipe.ingredients }}</p>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <h6 class="text-muted">Características</h6>
            <ul class="list-unstyled">
              <li *ngIf="recipe.isVegan" class="text-success">✅ Vegana</li>
              <li *ngIf="recipe.isGlutenFree" class="text-success">✅ Sin Gluten</li>
            </ul>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <h6 class="text-muted">Rating</h6>
            <p>⭐ {{ recipe.rating }}/5</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RecipeDetailComponent {
  @Input() recipe!: Recipe;

  getDifficultyClass(): string {
    const classes: any = {
      easy: 'bg-success',
      medium: 'bg-warning text-dark',
      hard: 'bg-danger'
    };
    return classes[this.recipe.difficulty] || 'bg-secondary';
  }
}
