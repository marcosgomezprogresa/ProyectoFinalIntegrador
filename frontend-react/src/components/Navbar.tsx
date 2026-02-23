import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const scrollToRecipes = () => {
    const element = document.getElementById('recipes-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold fs-5">
          🍳 Recetas de Marcos
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link active">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link"
                onClick={scrollToRecipes}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Recetas
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
