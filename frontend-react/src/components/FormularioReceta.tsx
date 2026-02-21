import React, { useState, useEffect } from 'react';
import { Recipe } from '../types/Recipe';
import { recipeService } from '../services/recipeService';
import './FormularioReceta.css';

interface FormularioRecetaProps {
  receta?: Recipe | null;
  onGuardada: (mensaje: string) => void;
  onCerrada: () => void;
}

export const FormularioReceta: React.FC<FormularioRecetaProps> = ({ receta, onGuardada, onCerrada }) => {
  const [formulario, setFormulario] = useState<Partial<Recipe>>({
    title: '',
    description: '',
    ingredients: '',
    preparationTime: 0,
    servings: 1,
    difficulty: 'medium',
    category: undefined,
    isVegan: false,
    isGlutenFree: false,
    rating: 0,
    imageUrl: ''
  });

  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [erroresValidacion, setErroresValidacion] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log('📝 FormularioReceta montado con receta:', receta);
    if (receta && receta._id) {
      console.log('✏️ Modo EDICIÓN');
      setFormulario(receta);
    } else {
      console.log('🆕 Modo CREAR');
      setFormulario({
        title: '',
        description: '',
        ingredients: '',
        preparationTime: 0,
        servings: 1,
        difficulty: 'medium',
        category: undefined,
        isVegan: false,
        isGlutenFree: false,
        rating: 0,
        imageUrl: ''
      });
    }
  }, [receta]);

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formulario.title || formulario.title.length < 3) {
      nuevosErrores.title = 'El título debe tener al menos 3 caracteres';
    }

    if (!formulario.description || formulario.description.length < 10) {
      nuevosErrores.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formulario.ingredients) {
      nuevosErrores.ingredients = 'Los ingredientes son requeridos';
    }

    if (!formulario.preparationTime || formulario.preparationTime < 1 || formulario.preparationTime > 1000) {
      nuevosErrores.preparationTime = 'Tiempo de preparación debe estar entre 1 y 1000 minutos';
    }

    if (!formulario.servings || formulario.servings < 1) {
      nuevosErrores.servings = 'Las porciones deben ser mínimo 1';
    }

    if (!formulario.category) {
      nuevosErrores.category = 'La categoría es requerida';
    }

    if (formulario.rating! < 0 || formulario.rating! > 5) {
      nuevosErrores.rating = 'El rating debe estar entre 0 y 5';
    }

    setErroresValidacion(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const alEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('💾 Enviando formulario...');

    if (!validar()) {
      setMensajeError('Por favor completa todos los campos correctamente');
      return;
    }

    setCargando(true);
    setMensajeError(null);

    try {
      if (receta && receta._id) {
        // Modo edición
        console.log('✏️ Actualizando receta:', receta._id);
        await recipeService.updateRecipe(receta._id, formulario);
        onGuardada('✅ Receta actualizada exitosamente');
      } else {
        // Modo crear
        console.log('🆕 Creando nueva receta');
        await recipeService.createRecipe(formulario);
        onGuardada('✅ Receta creada exitosamente');
      }
    } catch (error: any) {
      console.error('❌ Error:', error);
      setMensajeError('❌ Error: ' + (error.message || 'Error desconocido'));
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormulario({ ...formulario, [name]: checked });
    } else if (type === 'number') {
      setFormulario({ ...formulario, [name]: parseFloat(value) || 0 });
    } else {
      setFormulario({ ...formulario, [name]: value });
    }
  };

  return (
    <form onSubmit={alEnviar}>
      {/* Título */}
      <div className="mb-3">
        <label className="form-label">Título *</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={formulario.title || ''}
          onChange={handleChange}
        />
        {erroresValidacion.title && (
          <div className="form-text text-danger">{erroresValidacion.title}</div>
        )}
      </div>

      {/* Descripción */}
      <div className="mb-3">
        <label className="form-label">Descripción *</label>
        <textarea
          className="form-control"
          name="description"
          rows={2}
          value={formulario.description || ''}
          onChange={handleChange}
        />
        {erroresValidacion.description && (
          <div className="form-text text-danger">{erroresValidacion.description}</div>
        )}
      </div>

      {/* Ingredientes */}
      <div className="mb-3">
        <label className="form-label">Ingredientes *</label>
        <textarea
          className="form-control"
          name="ingredients"
          rows={2}
          value={formulario.ingredients || ''}
          onChange={handleChange}
        />
        {erroresValidacion.ingredients && (
          <div className="form-text text-danger">{erroresValidacion.ingredients}</div>
        )}
      </div>

      {/* Row: Tiempo y Porciones */}
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Tiempo de Preparación (min) *</label>
            <input
              type="number"
              className="form-control"
              name="preparationTime"
              min="1"
              max="1000"
              value={formulario.preparationTime || ''}
              onChange={handleChange}
            />
            {erroresValidacion.preparationTime && (
              <div className="form-text text-danger">{erroresValidacion.preparationTime}</div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Porciones *</label>
            <input
              type="number"
              className="form-control"
              name="servings"
              min="1"
              value={formulario.servings || ''}
              onChange={handleChange}
            />
            {erroresValidacion.servings && (
              <div className="form-text text-danger">{erroresValidacion.servings}</div>
            )}
          </div>
        </div>
      </div>

      {/* Row: Dificultad y Categoría */}
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Dificultad *</label>
            <select
              className="form-select"
              name="difficulty"
              value={formulario.difficulty || ''}
              onChange={handleChange}
            >
              <option value="">Seleccionar</option>
              <option value="easy">Fácil</option>
              <option value="medium">Media</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Categoría *</label>
            <select
              className="form-select"
              name="category"
              value={formulario.category || ''}
              onChange={handleChange}
            >
              <option value="">Seleccionar</option>
              <option value="entrante">Entrante</option>
              <option value="principal">Principal</option>
              <option value="postre">Postre</option>
              <option value="bebida">Bebida</option>
              <option value="refrigerio">Refrigerio</option>
            </select>
            {erroresValidacion.category && (
              <div className="form-text text-danger">{erroresValidacion.category}</div>
            )}
          </div>
        </div>
      </div>

      {/* Row: Rating y ImageUrl */}
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Rating (0-5)</label>
            <input
              type="number"
              className="form-control"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={formulario.rating || ''}
              onChange={handleChange}
            />
            {erroresValidacion.rating && (
              <div className="form-text text-danger">{erroresValidacion.rating}</div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">URL de Imagen</label>
            <input
              type="url"
              className="form-control"
              name="imageUrl"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formulario.imageUrl || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="isVegan"
          name="isVegan"
          checked={formulario.isVegan || false}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="isVegan">
          🌱 Es vegana
        </label>
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="isGlutenFree"
          name="isGlutenFree"
          checked={formulario.isGlutenFree || false}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="isGlutenFree">
          🚫 Sin gluten
        </label>
      </div>

      {/* Alerta Error */}
      {mensajeError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {mensajeError}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMensajeError(null)}
          ></button>
        </div>
      )}

      {/* Botones */}
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary flex-grow-1" disabled={cargando}>
          {cargando ? '⏳ Guardando...' : '💾 Guardar'}
        </button>
        <button type="button" className="btn btn-secondary flex-grow-1" onClick={onCerrada}>
          ❌ Cancelar
        </button>
      </div>
    </form>
  );
};
