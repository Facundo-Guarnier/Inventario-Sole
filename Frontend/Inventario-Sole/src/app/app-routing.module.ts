import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagTiendaFisicaComponent } from './paginas/pag-tienda-fisica/pag-tienda-fisica.component';
import { PagTiendaFisicaEditarComponent } from './paginas/pag-tienda-fisica-editar/pag-tienda-fisica-editar.component';

const routes: Routes = [
  { path: '', component: PagTiendaFisicaComponent},
  { path: 'tf/editar', component: PagTiendaFisicaEditarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
