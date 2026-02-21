import React from 'react';
import { Recipe } from '../types/Recipe';
import './DetalleReceta.css';

interface DetalleRecetaProps {
  receta: Recipe;
}

export const DetalleReceta: React.FC<DetalleRecetaProps> = ({ receta }) => {
  const obtenerClaseDificultad = (difficulty: string): string => {
    const clases: Record<string, string> = {
      easy: 'bg-success',
      medium: 'bg-warning text-dark',
      hard: 'bg-danger'
    };
    return clases[difficulty] || 'bg-secondary';
  };

  const obtenerEtiquetaCategoria = (category: string): string => {
    const etiquetas: Record<string, string> = {
      entrante: 'Entrante',
      principal: 'Principal',
      postre: 'Postre',
      bebida: 'Bebida',
      refrigerio: 'Refrigerio'
    };
    return etiquetas[category] || category;
  };

  return (
    <div>
      <div className="mb-3">
        {receta.imageUrl && (
          <img
            src={receta.imageUrl}
            alt={receta.title}
            className="img-fluid rounded mb-3"
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
          />
        )}
      </div>

      <div className="mb-3">
        <h6 className="text-muted">Título</h6>
        <p className="h5">{receta.title}</p>
      </div>

      <div className="mb-3">
        <h6 className="text-muted">Descripción</h6>
        <p>{receta.description}</p>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <h6 className="text-muted">Tiempo de Preparación</h6>
            <p>⏱️ {receta.preparationTime} minutos</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <h6 className="text-muted">Porciones</h6>
            <p>🍽️ {receta.servings} porciones</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <h6 className="text-muted">Dificultad</h6>
            <p>
              <span className={`badge ${obtenerClaseDificultad(receta.difficulty)}`}>
                {receta.difficulty.toUpperCase()}
              </span>
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <h6 className="text-muted">Categoría</h6>
            <p>
              <span className="badge bg-primary">{obtenerEtiquetaCategoria(receta.category)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <h6 className="text-muted">Ingredientes</h6>
        <p>{receta.ingredients}</p>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <h6 className="text-muted">Características</h6>
            <ul className="list-unstyled">
              {receta.isVegan && <li className="text-success">✅ Vegana</li>}
              {receta.isGlutenFree && <li className="text-success">✅ Sin Gluten</li>}
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <h6 className="text-muted">Rating</h6>
            <p>⭐ {receta.rating}/5</p>
          </div>
        </div>
      </div>
    </div>
  );
};
