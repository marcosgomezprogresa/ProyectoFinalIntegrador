import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
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
