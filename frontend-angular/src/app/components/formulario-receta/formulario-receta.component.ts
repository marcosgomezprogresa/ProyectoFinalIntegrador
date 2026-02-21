import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-formulario-receta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="formulario" (ngSubmit)="alEnviar()">
      <div class="mb-3">
        <label class="form-label">Título *</label>
        <input type="text" class="form-control" formControlName="title" required>
        <div class="form-text text-danger" *ngIf="formulario.get('title')?.hasError('required') && formulario.get('title')?.touched">
          El título es requerido
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Descripción *</label>
        <textarea class="form-control" formControlName="description" rows="2" required></textarea>
        <div class="form-text text-danger" *ngIf="formulario.get('description')?.hasError('required') && formulario.get('description')?.touched">
          La descripción es requerida (mín. 10 caracteres)
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Ingredientes *</label>
        <textarea class="form-control" formControlName="ingredients" rows="2" required></textarea>
        <div class="form-text text-danger" *ngIf="formulario.get('ingredients')?.hasError('required') && formulario.get('ingredients')?.touched">
          Los ingredientes son requeridos
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Tiempo de Preparación (min) *</label>
            <input type="number" class="form-control" formControlName="preparationTime" min="1" max="1000" required>
            <div class="form-text text-danger" *ngIf="formulario.get('preparationTime')?.hasError('required') && formulario.get('preparationTime')?.touched">
              Tiempo requerido (1-1000 min)
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Porciones *</label>
            <input type="number" class="form-control" formControlName="servings" min="1" required>
            <div class="form-text text-danger" *ngIf="formulario.get('servings')?.hasError('required') && formulario.get('servings')?.touched">
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
              <option value="entrante">Entrante</option>
              <option value="principal">Principal</option>
              <option value="postre">Postre</option>
              <option value="bebida">Bebida</option>
              <option value="refrigerio">Refrigerio</option>
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
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">URL de Imagen</label>
            <input type="url" class="form-control" formControlName="imageUrl" placeholder="https://ejemplo.com/imagen.jpg">
          </div>
        </div>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" formControlName="isVegan" id="esVegana">
        <label class="form-check-label" for="esVegana">
          Es Vegana 🌱
        </label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" formControlName="isGlutenFree" id="sinGluten">
        <label class="form-check-label" for="sinGluten">
          Sin Gluten 🌾
        </label>
      </div>

      <div *ngIf="mensajeError" class="alert alert-danger">
        {{ mensajeError }}
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" [disabled]="!formulario.valid || cargando">
          <span *ngIf="cargando" class="spinner-border spinner-border-sm me-2"></span>
          {{ esEdicion ? 'Actualizar' : 'Crear' }}
        </button>
        <button type="button" class="btn btn-secondary" (click)="alCancelar()">Cancelar</button>
      </div>
    </form>
  `,
  styles: []
})
export class FormularioRecetaComponent implements OnInit {
  @Output() guardada = new EventEmitter<string>();
  @Output() cerrada = new EventEmitter<void>();

  private _receta: Recipe | null = null;
  
  @Input() set receta(value: Recipe | null) {
    console.log('📥 @Input receta cambió:', value);
    this._receta = value;
    
    // Si tenemos receta y el formulario ya está inicializado, precargar datos
    if (this.formulario && this._receta && this._receta._id) {
      console.log('✏️ Precargando datos de receta en el setter');
      this.precargarReceta();
    } else if (this.formulario && !this._receta) {
      // Si NO hay receta (modo crear), resetear formulario
      console.log('🆕 Reseteando formulario para crear nueva receta');
      this.formulario.reset({
        title: '',
        description: '',
        ingredients: '',
        preparationTime: '',
        servings: '',
        difficulty: 'medium',
        category: '',
        isVegan: false,
        isGlutenFree: false,
        rating: 0,
        imageUrl: ''
      });
      this.esEdicion = false;
      this.cdr.detectChanges();
    }
  }
  
  get receta(): Recipe | null {
    return this._receta;
  }

  formulario!: FormGroup;
  cargando = false;
  mensajeError: string | null = null;
  esEdicion = false;

  constructor(private fb: FormBuilder, private recipeService: RecipeService, private cdr: ChangeDetectorRef) {
    this.inicializarFormulario();
  }

  ngOnInit() {
    console.log('📝 FormularioRecetaComponent ngOnInit iniciado');
    
    // Si ya tenemos receta en ngOnInit, precargar
    if (this.receta && this.receta._id) {
      console.log('✏️ Precargando en ngOnInit');
      this.precargarReceta();
    } else {
      console.log('🆕 Modo CREAR nueva receta');
      this.esEdicion = false;
    }
  }

  private precargarReceta() {
    if (!this.receta || !this.receta._id) return;
    
    this.esEdicion = true;
    console.log('Valores de receta a precargar:', this.receta);
    
    const valoresReceta = {
      title: this.receta.title || '',
      description: this.receta.description || '',
      ingredients: this.receta.ingredients || '',
      preparationTime: this.receta.preparationTime || 0,
      servings: this.receta.servings || 1,
      difficulty: this.receta.difficulty || 'medium',
      category: this.receta.category || '',
      isVegan: this.receta.isVegan || false,
      isGlutenFree: this.receta.isGlutenFree || false,
      rating: this.receta.rating || 0,
      imageUrl: this.receta.imageUrl || ''
    };
    
    console.log('Parchando formulario con:', valoresReceta);
    this.formulario.patchValue(valoresReceta);
    this.cdr.detectChanges();
    console.log('✅ Formulario parchado y detectados cambios');
  }

  private inicializarFormulario() {
    this.formulario = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      ingredients: ['', Validators.required],
      preparationTime: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      servings: ['', [Validators.required, Validators.min(1)]],
      difficulty: ['medium', Validators.required],
      category: ['', Validators.required],
      isVegan: [false],
      isGlutenFree: [false],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      imageUrl: ['']
    });
  }

  alEnviar() {
    if (!this.formulario.valid) {
      this.mensajeError = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.cargando = true;
    this.mensajeError = null;

    if (this.esEdicion && this.receta) {
      this.recipeService.updateRecipe(this.receta._id!, this.formulario.value).subscribe({
        next: (response) => {
          this.cargando = false;
          this.guardada.emit('✅ Receta actualizada exitosamente');
        },
        error: (error) => {
          this.cargando = false;
          this.mensajeError = '❌ Error: ' + (error.error.message || error.message);
        }
      });
    } else {
      this.recipeService.createRecipe(this.formulario.value).subscribe({
        next: (response) => {
          this.cargando = false;
          this.guardada.emit('✅ Receta creada exitosamente');
          this.formulario.reset();
        },
        error: (error) => {
          this.cargando = false;
          this.mensajeError = '❌ Error: ' + (error.error.message || error.message);
        }
      });
    }
  }

  alCancelar() {
    this.cerrada.emit();
  }
}
