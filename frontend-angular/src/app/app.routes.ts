import { Routes } from '@angular/router';
import { ListadoRecetasComponent } from './components/listado-recetas/listado-recetas.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/recetas',
    pathMatch: 'full'
  },
  {
    path: 'recetas',
    component: ListadoRecetasComponent,
    title: '🍳 Recetas de Marcos'
  },
  {
    path: '**',
    redirectTo: '/recetas'
  }
];
