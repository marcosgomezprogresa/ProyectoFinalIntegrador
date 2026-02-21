import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe, PaginatedResponse } from '../../models/recipe.model';
import { DetalleRecetaComponent } from '../detalle-receta/detalle-receta.component';
import { FormularioRecetaComponent } from '../formulario-receta/formulario-receta.component';

@Component({
  selector: 'app-listado-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DetalleRecetaComponent, FormularioRecetaComponent],
  templateUrl: './listado-recetas.component.html',
  styleUrls: ['./listado-recetas.component.css']
})
export class ListadoRecetasComponent implements OnInit {
  recetas: Recipe[] = [];
  recetaSeleccionada: Recipe | null = null;
  recetaEditando: Recipe | null = null;
  cargando = false;
  mensajeError: string | null = null;
  mensajeExito: string | null = null;
  categoriaSeleccionada = '';
  
  paginacion = {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  };

  constructor(private recipeService: RecipeService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('🚀 ListadoRecetasComponent ngOnInit iniciado');
    this.cargarRecetas();
  }

  cargarRecetas() {
    console.log('📥 cargarRecetas() llamado');
    this.cargando = true;
    this.mensajeError = null;
    this.categoriaSeleccionada = '';
    
    this.recipeService.getAllRecipes(this.paginacion.page, this.paginacion.limit).subscribe({
      next: (response) => {
        console.log('✅ Respuesta getAllRecipes:', response);
        console.log('📊 Datos recibidos:', response.data);
        console.log('📄 Total recetas:', response.pagination.total);
        this.recetas = response.data;
        this.paginacion = response.pagination;
        this.cargando = false;
        this.cdr.detectChanges(); // Forzar detección de cambios
        console.log('📋 this.recetas ahora tiene:', this.recetas.length, 'recetas');
      },
      error: (error) => {
        console.error('❌ Error en getAllRecipes:', error);
        this.mensajeError = 'Error al cargar recetas: ' + error.message;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  alCambiarCategoria() {
    console.log('🔍 alCambiarCategoria() llamado con:', this.categoriaSeleccionada);
    if (!this.categoriaSeleccionada || this.categoriaSeleccionada.trim() === '') {
      console.log('📌 Categoría vacía, cargando todas');
      this.cargarRecetas();
      return;
    }

    this.paginacion.page = 1;
    this.cargando = true;
    this.recetas = []; // Limpiar inmediatamente
    this.mensajeError = null;
    
    setTimeout(() => {
      console.log('🌐 Buscando categoría:', this.categoriaSeleccionada);
      this.recipeService.getRecipesByCategory(this.categoriaSeleccionada, this.paginacion.page, this.paginacion.limit).subscribe({
        next: (response) => {
          console.log('✅ Respuesta getRecipesByCategory:', response);
          console.log('📊 Datos por categoría:', response.data.length, 'recetas');
          this.recetas = response.data;
          this.paginacion = response.pagination;
          this.cargando = false;
          this.cdr.detectChanges(); // Forzar detección de cambios
        },
        error: (error) => {
          console.error('❌ Error en getRecipesByCategory:', error);
          this.mensajeError = '❌ Error al filtrar recetas: ' + (error.error?.message || error.message);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }, 100);
  }

  obtenerRecetasVeganas() {
    this.paginacion.page = 1;
    this.cargando = true;
    this.mensajeError = null;
    this.categoriaSeleccionada = '';
    
    this.recipeService.getVeganRecipes(this.paginacion.page, this.paginacion.limit).subscribe({
      next: (response) => {
        this.recetas = response.data;
        this.paginacion = response.pagination;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensajeError = 'Error al cargar recetas veganas: ' + error.message;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  irAPagina(page: number) {
    if (page >= 1 && page <= this.paginacion.pages) {
      this.paginacion.page = page;
      if (this.categoriaSeleccionada) {
        this.alCambiarCategoria();
      } else {
        this.cargarRecetas();
      }
    }
  }

  verReceta(receta: Recipe) {
    this.recetaSeleccionada = receta;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('detalleModal'));
    modal.show();
  }

  cerrarDetalleModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('detalleModal'));
    if (modal) modal.hide();
  }

  editarReceta(receta: Recipe) {
    this.recetaEditando = { ...receta };
    const modal = new (window as any).bootstrap.Modal(document.getElementById('formularioModal'));
    modal.show();
  }

  abrirFormularioModal() {
    this.recetaEditando = null;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('formularioModal'));
    modal.show();
  }

  cerrarFormularioModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('formularioModal'));
    if (modal) modal.hide();
    this.recetaEditando = null;
  }

  alRecetaGuardada(mensaje: string) {
    this.mensajeExito = mensaje;
    this.cerrarFormularioModal();
    this.cargarRecetas();
    setTimeout(() => this.mensajeExito = null, 3000);
  }

  eliminarReceta(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      this.recipeService.deleteRecipe(id).subscribe({
        next: () => {
          this.mensajeExito = '✅ Receta eliminada exitosamente';
          this.cargarRecetas();
          setTimeout(() => this.mensajeExito = null, 3000);
        },
        error: (error) => {
          this.mensajeError = '❌ Error al eliminar: ' + error.error.message;
        }
      });
    }
  }

  obtenerEtiquetaCategoria(category: string): string {
    const etiquetas: any = {
      entrante: 'Entrante',
      principal: 'Principal',
      postre: 'Postre',
      bebida: 'Bebida',
      refrigerio: 'Refrigerio'
    };
    return etiquetas[category] || category;
  }

  obtenerClaseBadgeCategoria(category: string): string {
    const clases: any = {
      entrante: 'bg-info',
      principal: 'bg-primary',
      postre: 'bg-danger',
      bebida: 'bg-success',
      refrigerio: 'bg-warning'
    };
    return clases[category] || 'bg-secondary';
  }

  obtenerEtiquetaDificultad(difficulty: string): string {
    const etiquetas: any = {
      easy: 'Fácil',
      medium: 'Media',
      hard: 'Difícil'
    };
    return etiquetas[difficulty] || difficulty;
  }

  obtenerClaseBadgeDificultad(difficulty: string): string {
    const clases: any = {
      easy: 'bg-success',
      medium: 'bg-warning text-dark',
      hard: 'bg-danger'
    };
    return clases[difficulty] || 'bg-secondary';
  }
}
