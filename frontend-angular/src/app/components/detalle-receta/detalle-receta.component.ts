import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-detalle-receta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-receta.component.html',
  styleUrls: ['./detalle-receta.component.css']
})
export class DetalleRecetaComponent {
  @Input() receta!: Recipe;

  obtenerClaseDificultad(): string {
    const clases: any = {
      easy: 'bg-success',
      medium: 'bg-warning text-dark',
      hard: 'bg-danger'
    };
    return clases[this.receta.difficulty] || 'bg-secondary';
  }
}
