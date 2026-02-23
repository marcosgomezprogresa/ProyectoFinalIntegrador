import React, { useState, useEffect } from 'react';
import { Recipe } from '../types/Recipe';
import { recipeService } from '../services/recipeService';
import { DetalleReceta } from './DetalleReceta';
import { FormularioReceta } from './FormularioReceta';
import './ListadoRecetas.css';

export const ListadoRecetas: React.FC = () => {
  const [recetas, setRecetas] = useState<Recipe[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Recipe | null>(null);
  const [recetaEditando, setRecetaEditando] = useState<Recipe | null>(null);
  const [mostrarDetalleModal, setMostrarDetalleModal] = useState(false);
  const [mostrarFormularioModal, setMostrarFormularioModal] = useState(false);

  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarRecetas = async (page: number = 1) => {
    console.log('📥 Cargando recetas...', `Página: ${page}`);
    setCargando(true);
    setMensajeError(null);
    setCategoriaSeleccionada('');

    try {
      const response = await recipeService.getAllRecipes(page, paginacion.limit);
      console.log('✅ Recetas cargadas:', response);
      setRecetas(response.data);
      setPaginacion(response.pagination);
    } catch (error: any) {
      console.error('❌ Error:', error);
      setMensajeError('Error al cargar recetas: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const alCambiarCategoria = async () => {
    console.log('🔍 Filtrando por categoría:', categoriaSeleccionada);
    if (!categoriaSeleccionada) {
      cargarRecetas();
      return;
    }

    setCargando(true);
    setRecetas([]);
    setMensajeError(null);

    try {
      const response = await recipeService.getRecipesByCategory(categoriaSeleccionada, 1, paginacion.limit);
      console.log('✅ Recetas filtradas:', response);
      setRecetas(response.data);
      setPaginacion(response.pagination);
    } catch (error: any) {
      console.error('❌ Error:', error);
      setMensajeError('Error al filtrar recetas: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const obtenerRecetasVeganas = async () => {
    console.log('🌱 Cargando recetas veganas...');
    setCargando(true);
    setMensajeError(null);
    setCategoriaSeleccionada('');

    try {
      const response = await recipeService.getVeganRecipes(1, paginacion.limit);
      console.log('✅ Recetas veganas cargadas:', response);
      setRecetas(response.data);
      setPaginacion(response.pagination);
    } catch (error: any) {
      console.error('❌ Error:', error);
      setMensajeError('Error al cargar recetas veganas: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const verReceta = (receta: Recipe) => {
    console.log('👁️ Ver receta:', receta);
    setRecetaSeleccionada(receta);
    setMostrarDetalleModal(true);
  };

  const editarReceta = (receta: Recipe) => {
    console.log('✏️ Editar receta:', receta);
    setRecetaEditando({ ...receta });
    setMostrarFormularioModal(true);
  };

  const eliminarReceta = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta receta?')) return;

    try {
      await recipeService.deleteRecipe(id);
      setMensajeExito('✅ Receta eliminada exitosamente');
      cargarRecetas();
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error: any) {
      setMensajeError('❌ Error al eliminar: ' + error.message);
    }
  };

  const abrirFormularioCrear = () => {
    console.log('🆕 Crear nueva receta');
    setRecetaEditando(null);
    setMostrarFormularioModal(true);
  };

  const alRecetaGuardada = (mensaje: string) => {
    console.log('💾 Receta guardada:', mensaje);
    setMensajeExito(mensaje);
    setMostrarFormularioModal(false);
    cargarRecetas();
    setTimeout(() => setMensajeExito(null), 3000);
  };

  const irAPagina = (page: number) => {
    if (page >= 1 && page <= paginacion.pages) {
      // Llamar cargarRecetas con el nuevo número de página directamente
      cargarRecetas(page);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Sidebar Filtros */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Filtros</h5>
              <div className="mb-3">
                <label className="form-label">Categoría</label>
                <div className="input-group">
                  <select
                    className="form-select"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="entrante">Entrante</option>
                    <option value="principal">Principal</option>
                    <option value="postre">Postre</option>
                    <option value="bebida">Bebida</option>
                    <option value="refrigerio">Refrigerio</option>
                  </select>
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={alCambiarCategoria}
                    title="Buscar"
                  >
                    🔍
                  </button>
                </div>
              </div>
              <button className="btn btn-warning w-100 mb-2" onClick={obtenerRecetasVeganas}>
                🌱 Veganas
              </button>
              <button className="btn btn-info w-100" onClick={cargarRecetas}>
                Todas
              </button>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">Crear Receta</h5>
              <button className="btn btn-success w-100" onClick={abrirFormularioCrear}>
                + Nueva Receta
              </button>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="col-md-9">
          {/* Spinner Cargando */}
          {cargando && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}

          {/* Alerta Error */}
          {mensajeError && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {mensajeError}
              <button type="button" className="btn-close" onClick={() => setMensajeError(null)}></button>
            </div>
          )}

          {/* Alerta Éxito */}
          {mensajeExito && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {mensajeExito}
              <button type="button" className="btn-close" onClick={() => setMensajeExito(null)}></button>
            </div>
          )}

          {/* Grid Tarjetas Recetas */}
          <div className="mb-5">
            <h3 className="mb-4 fw-bold">📋 Recetas ({paginacion.total} total)</h3>
            
            {recetas.length > 0 ? (
              <>
                <div className="row g-4">
                  {recetas.map((receta) => (
                    <div key={receta._id} className="col-lg-4 col-md-6">
                      <div className="card h-100 shadow-sm border-0">
                        {/* Imagen o Placeholder */}
                        <div style={{ height: '180px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {receta.imageUrl ? (
                            <img src={receta.imageUrl} alt={receta.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ fontSize: '3rem' }}>🍳</div>
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="card-body d-flex flex-column">
                          {/* Tags */}
                          <div className="mb-2">
                            <span className={`badge me-2 ${obtenerClaseBadgeCategoria(receta.category)}`}>
                              {obtenerEtiquetaCategoria(receta.category)}
                            </span>
                            <span className={`badge me-2 ${obtenerClaseBadgeDificultad(receta.difficulty)}`}>
                              {obtenerEtiquetaDificultad(receta.difficulty)}
                            </span>
                            {receta.isVegan && <span className="badge bg-success me-2">🌱 Vegana</span>}
                            {receta.isGlutenFree && <span className="badge bg-info">🚫 Sin Gluten</span>}
                          </div>

                          {/* Título */}
                          <h6 className="card-title fw-bold mb-2">{receta.title}</h6>

                          {/* Descripción */}
                          <p className="card-text text-muted small flex-grow-1">{receta.description?.substring(0, 80)}...</p>

                          {/* Info */}
                          <div className="d-flex justify-content-between text-muted small mb-3 border-top border-bottom py-2">
                            <span>⏱️ {receta.preparationTime} min</span>
                            <span>👥 {receta.servings} porciones</span>
                            <span>⭐ {receta.rating}/5</span>
                          </div>

                          {/* Acciones */}
                          <div className="d-grid gap-2">
                            <button 
                              className="btn btn-sm btn-primary" 
                              onClick={() => verReceta(receta)}
                            >
                              👁️ Ver Detalles
                            </button>
                            <button 
                              className="btn btn-sm btn-warning" 
                              onClick={() => editarReceta(receta)}
                            >
                              ✏️ Editar
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => eliminarReceta(receta._id!)}
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                <nav className="d-flex justify-content-center mt-5">
                  <ul className="pagination">
                    <li className={`page-item ${paginacion.page <= 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => irAPagina(paginacion.page - 1)}
                        disabled={paginacion.page <= 1}
                      >
                        ← Anterior
                      </button>
                    </li>
                    <li className="page-item active">
                      <span className="page-link">
                        Página {paginacion.page}/{paginacion.pages}
                      </span>
                    </li>
                    <li className={`page-item ${paginacion.page >= paginacion.pages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => irAPagina(paginacion.page + 1)}
                        disabled={paginacion.page >= paginacion.pages}
                      >
                        Siguiente →
                      </button>
                    </li>
                  </ul>
                </nav>
              </>
            ) : (
              <div className="alert alert-info text-center">
                <p className="mb-0">No hay recetas disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Detalle */}
      {mostrarDetalleModal && recetaSeleccionada && (
        <div className="modal-overlay" onClick={() => setMostrarDetalleModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Detalles de Receta</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setMostrarDetalleModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <DetalleReceta receta={recetaSeleccionada} />
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulario */}
      {mostrarFormularioModal && (
        <div className="modal-overlay" onClick={() => setMostrarFormularioModal(false)}>
          <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">{recetaEditando ? 'Editar Receta' : 'Nueva Receta'}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setMostrarFormularioModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <FormularioReceta
                receta={recetaEditando}
                onGuardada={alRecetaGuardada}
                onCerrada={() => setMostrarFormularioModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Funciones auxiliares
function obtenerEtiquetaCategoria(category: string): string {
  const etiquetas: Record<string, string> = {
    entrante: 'Entrante',
    principal: 'Principal',
    postre: 'Postre',
    bebida: 'Bebida',
    refrigerio: 'Refrigerio'
  };
  return etiquetas[category] || category;
}

function obtenerClaseBadgeCategoria(category: string): string {
  const clases: Record<string, string> = {
    entrante: 'bg-info',
    principal: 'bg-primary',
    postre: 'bg-danger',
    bebida: 'bg-success',
    refrigerio: 'bg-warning text-dark'
  };
  return clases[category] || 'bg-secondary';
}

function obtenerEtiquetaDificultad(difficulty: string): string {
  const etiquetas: Record<string, string> = {
    easy: 'Fácil',
    medium: 'Media',
    hard: 'Difícil'
  };
  return etiquetas[difficulty] || difficulty;
}

function obtenerClaseBadgeDificultad(difficulty: string): string {
  const clases: Record<string, string> = {
    easy: 'bg-success',
    medium: 'bg-warning text-dark',
    hard: 'bg-danger'
  };
  return clases[difficulty] || 'bg-secondary';
}
