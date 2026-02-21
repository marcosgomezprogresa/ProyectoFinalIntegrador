import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
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
