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

  const cargarRecetas = async () => {
    console.log('📥 Cargando recetas...');
    setCargando(true);
    setMensajeError(null);
    setCategoriaSeleccionada('');

    try {
      const response = await recipeService.getAllRecipes(paginacion.page, paginacion.limit);
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
      setPaginacion({ ...paginacion, page });
      // Aquí se podría hacer otra llamada a la API con la nueva página
      cargarRecetas();
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

          {/* Tabla Recetas */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Recetas ({paginacion.total} total)</h5>
              <div className="table-responsive">
                <table className="table table-hover">
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
                    {recetas.map((receta) => (
                      <tr key={receta._id}>
                        <td>{receta.title}</td>
                        <td>
                          <span className={`badge ${obtenerClaseBadgeCategoria(receta.category)}`}>
                            {obtenerEtiquetaCategoria(receta.category)}
                          </span>
                        </td>
                        <td>{receta.preparationTime}</td>
                        <td>
                          <span className={`badge ${obtenerClaseBadgeDificultad(receta.difficulty)}`}>
                            {obtenerEtiquetaDificultad(receta.difficulty)}
                          </span>
                        </td>
                        <td>⭐ {receta.rating}</td>
                        <td>
                          <button className="btn btn-sm btn-primary" onClick={() => verReceta(receta)}>
                            Ver
                          </button>
                          <button className="btn btn-sm btn-warning ms-1" onClick={() => editarReceta(receta)}>
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-danger ms-1"
                            onClick={() => eliminarReceta(receta._id!)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${paginacion.page <= 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => irAPagina(paginacion.page - 1)}
                      disabled={paginacion.page <= 1}
                    >
                      Anterior
                    </button>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">
                      Página {paginacion.page} de {paginacion.pages}
                    </span>
                  </li>
                  <li className={`page-item ${paginacion.page >= paginacion.pages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => irAPagina(paginacion.page + 1)}
                      disabled={paginacion.page >= paginacion.pages}
                    >
                      Siguiente
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
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
