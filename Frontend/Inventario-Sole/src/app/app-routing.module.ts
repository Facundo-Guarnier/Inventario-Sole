import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagTiendaFisicaComponent } from './paginas/pag-tienda-fisica/pag-tienda-fisica.component';


const routes: Routes = [
  { path: '', component: PagTiendaFisicaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
