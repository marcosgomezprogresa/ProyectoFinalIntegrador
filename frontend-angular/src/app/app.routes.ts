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
/* Trabajo con modales de Bootstrap para el CRUD, por lo que toda
 la funcionalidad está en una sola página. 
 No necesito rutas individuales para crear/editar/ver porque 
 se manejan con modales que no cambian la URL*/ 