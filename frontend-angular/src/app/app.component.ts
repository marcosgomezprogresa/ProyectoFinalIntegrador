import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ListadoRecetasComponent } from './components/listado-recetas/listado-recetas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ListadoRecetasComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1 fw-bold">🍳 Recetas de Marcos</span>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link active" href="#" (click)="scrollToTop(); $event.preventDefault()">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" (click)="openAPI(); $event.preventDefault()">🔌 API</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container-fluid mt-4">
      <app-listado-recetas></app-listado-recetas>
    </div>
  `,
  styles: [`
    :host {
      --bs-body-bg: #f8f9fa;
    }
  `]
})
export class AppComponent {
  title = 'Recipe Management System';

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openAPI() {
    window.open('https://proyectofinalintegradorbackend.vercel.app/', '_blank');
  }
}
