import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//! Importar las páginas
import { PagProductosCrearComponent } from './paginas/productos/crear/crear.component';
import { PagProductosDetalleEditarComponent } from './paginas/productos/detalle-editar/detalle-editar.component';

import { PagTiendaFisicaVistaGeneralComponent } from './paginas/tienda-fisica/vista-general/vista-general.component';
import { PagTiendaOnlineVistaGeneralComponent } from './paginas/tienda-online/vista-general/vista-general.component';

import { PagVentasCrearComponent } from './paginas/ventas/crear/crear.component';
import { PagVentasDetalleEditarComponent } from './paginas/ventas/detalle-editar/detalle-editar.component';
import { PagVentasVistaGeneralComponent } from './paginas/ventas/vista-general/vista-general.component';

import { PagGiftCardsVistaGeneralComponent } from './paginas/gift-cards/vista-general/vista-general.component';
import { PagGiftCardsDetalleEditarComponent } from './paginas/gift-cards/detalle-editar/detalle-editar.component';
import { PagGiftCardsCrearComponent } from './paginas/gift-cards/crear/crear.component';

import { PagRegalosVistaGeneralComponent } from './paginas/regalos/vista-general/vista-general.component';
import { PagRegalosCrearComponent } from './paginas/regalos/crear/crear.component';
import { PagRegalosDetalleEditarComponent } from './paginas/regalos/detalle-editar/detalle-editar.component';

import { PagMovimientosDetalleComponent } from './paginas/movimientos/detalle/detalle.component';
import { PagMovimientosCrearComponent } from './paginas/movimientos/crear/crear.component';
import { PagMovimientosVistaGeneralComponent } from './paginas/movimientos/vista-general/vista-general.component';


const routes: Routes = [
  { path: '', redirectTo: 'mov', pathMatch: 'full' },

  { path: 'ven', component: PagVentasVistaGeneralComponent},
  { path: 'ven/crear', component: PagVentasCrearComponent},
  { path: 'ven/detalle-editar', component: PagVentasDetalleEditarComponent},
  
  { path: 'tf', component: PagTiendaFisicaVistaGeneralComponent},
  { path: 'to', component: PagTiendaOnlineVistaGeneralComponent},
  
  // { path: 'prod/detalle-editar/:id', component: PagProductosDetalleEditarComponent},
  { path: 'prod/detalle-editar', component: PagProductosDetalleEditarComponent},
  { path: 'prod/crear', component: PagProductosCrearComponent},

  { path: "mov", component: PagMovimientosVistaGeneralComponent},
  { path: "mov/crear", component: PagMovimientosCrearComponent},
  // { path: "mov/detalle/:id", component: PagMovimientosDetalleComponent},
  { path: "mov/detalle", component: PagMovimientosDetalleComponent},

  { path: "reg", component: PagRegalosVistaGeneralComponent},
  { path: "reg/crear", component: PagRegalosCrearComponent},
  { path: "reg/detalle-editar/:id", component: PagRegalosDetalleEditarComponent},
  { path: "reg/detalle-editar", component: PagRegalosDetalleEditarComponent},

  { path: "gc", component: PagGiftCardsVistaGeneralComponent},
  { path: "gc/crear", component: PagGiftCardsCrearComponent},
  // { path: "gc/detalle-editar/:id", component: PagGiftCardsDetalleEditarComponent},
  { path: "gc/detalle-editar", component: PagGiftCardsDetalleEditarComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
