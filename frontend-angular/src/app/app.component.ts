import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ListadoRecetasComponent } from './components/listado-recetas/listado-recetas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ListadoRecetasComponent],
  template: `
    <nav class="navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">🍳 Gestión de Recetas</span>
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
}
