import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-formulario-receta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-receta.component.html',
  styleUrls: ['./formulario-receta.component.css']
})
export class FormularioRecetaComponent implements OnInit {
  //sistema de comunicacion hijo padre, con el listado
  @Output() guardada = new EventEmitter<string>();
  @Output() cerrada = new EventEmitter<void>();

  private _receta: Recipe | null = null;
  
  @Input() set receta(value: Recipe | null) {
    console.log('📥 @Input receta cambió:', value);
    this._receta = value;
    //pariable privada para aaceso con un setter o getter _receta
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
