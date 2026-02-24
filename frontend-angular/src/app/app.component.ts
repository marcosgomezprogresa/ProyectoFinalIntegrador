import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container-fluid mt-4">
      <router-outlet></router-outlet>
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
