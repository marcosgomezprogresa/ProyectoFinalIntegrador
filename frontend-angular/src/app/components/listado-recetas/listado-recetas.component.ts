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
  template: `
    <div class="row">
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Filtros</h5>
            <div class="mb-3">
              <label class="form-label">Categoría</label>
              <div class="input-group">
                <select class="form-select" [(ngModel)]="categoriaSeleccionada">
                  <option value="">Todas</option>
                  <option value="entrante">Entrante</option>
                  <option value="principal">Principal</option>
                  <option value="postre">Postre</option>
                  <option value="bebida">Bebida</option>
                  <option value="refrigerio">Refrigerio</option>
                </select>
                <button class="btn btn-outline-primary" type="button" (click)="alCambiarCategoria()" title="Buscar">
                  🔍
                </button>
              </div>
            </div>
            <button class="btn btn-warning w-100 mb-2" (click)="obtenerRecetasVeganas()">
              🌱 Veganas
            </button>
            <button class="btn btn-info w-100" (click)="cargarRecetas()">
              Todas
            </button>
          </div>
        </div>

        <div class="card mt-3">
          <div class="card-body">
            <h5 class="card-title">Crear Receta</h5>
            <button class="btn btn-success w-100" (click)="abrirFormularioModal()">
              + Nueva Receta
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <!-- Cargando -->
        <div *ngIf="cargando" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <!-- Alerta Error -->
        <div *ngIf="mensajeError" class="alert alert-danger alert-dismissible fade show" role="alert">
          {{ mensajeError }}
          <button type="button" class="btn-close" (click)="mensajeError = null"></button>
        </div>

        <!-- Alerta Éxito -->
        <div *ngIf="mensajeExito" class="alert alert-success alert-dismissible fade show" role="alert">
          {{ mensajeExito }}
          <button type="button" class="btn-close" (click)="mensajeExito = null"></button>
        </div>

        <!-- Tabla Recetas -->
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Recetas ({{paginacion.total}} total)</h5>
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
                  <tr *ngFor="let receta of recetas">
                    <td>{{ receta.title }}</td>
                    <td>
                      <span class="badge" [ngClass]="obtenerClaseBadgeCategoria(receta.category)">
                        {{ obtenerEtiquetaCategoria(receta.category) }}
                      </span>
                    </td>
                    <td>{{ receta.preparationTime }}</td>
                    <td>
                      <span class="badge" [ngClass]="obtenerClaseBadgeDificultad(receta.difficulty)">
                        {{ obtenerEtiquetaDificultad(receta.difficulty) }}
                      </span>
                    </td>
                    <td>⭐ {{ receta.rating }}</td>
                    <td>
                      <button class="btn btn-sm btn-primary" (click)="verReceta(receta)">Ver</button>
                      <button class="btn btn-sm btn-warning ms-1" (click)="editarReceta(receta)">Editar</button>
                      <button class="btn btn-sm btn-danger ms-1" (click)="eliminarReceta(receta._id!)">Eliminar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Paginación -->
            <nav>
              <ul class="pagination justify-content-center">
                <li class="page-item" [class.disabled]="paginacion.page <= 1">
                  <button class="page-link" (click)="irAPagina(paginacion.page - 1)" [disabled]="paginacion.page <= 1">
                    Anterior
                  </button>
                </li>
                <li class="page-item active">
                  <span class="page-link">Página {{ paginacion.page }} de {{ paginacion.pages }}</span>
                </li>
                <li class="page-item" [class.disabled]="paginacion.page >= paginacion.pages">
                  <button class="page-link" (click)="irAPagina(paginacion.page + 1)" [disabled]="paginacion.page >= paginacion.pages">
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detalle -->
    <div class="modal fade" id="detalleModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles de Receta</h5>
            <button type="button" class="btn-close" (click)="cerrarDetalleModal()"></button>
          </div>
          <div class="modal-body">
            <app-detalle-receta *ngIf="recetaSeleccionada" [receta]="recetaSeleccionada"></app-detalle-receta>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Formulario -->
    <div class="modal fade" id="formularioModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ recetaEditando ? 'Editar Receta' : 'Nueva Receta' }}</h5>
            <button type="button" class="btn-close" (click)="cerrarFormularioModal()"></button>
          </div>
          <div class="modal-body">
            <app-formulario-receta 
              [receta]="recetaEditando" 
              (guardada)="alRecetaGuardada($event)"
              (cerrada)="cerrarFormularioModal()">
            </app-formulario-receta>
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
