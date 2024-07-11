import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//! Importar las páginas
import { PagProductosCrearComponent } from './paginas/productos/crear/crear.component';
import { PagProductosDetalleEditarComponent } from './paginas/productos/detalle-editar/detalle-editar.component';

import { PagTiendaFisicaVistaGeneralComponent } from './paginas/tienda-fisica/vista-general/vista-general.component';
import { PagTiendaFisicaRevisarStockComponent } from './paginas/tienda-fisica/revisar-stock/revisar-stock.component';

import { PagTiendaOnlineVistaGeneralComponent } from './paginas/tienda-online/vista-general/vista-general.component';
import { PagTiendaOnlineRevisarStockComponent } from './paginas/tienda-online/revisar-stock/revisar-stock.component';

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

import { PagUsuarioVistaGeneralComponent } from './paginas/usuarios/vista-general/vista-general.component';
import { PagUsuarioCrearComponent } from './paginas/usuarios/crear/crear.component';
import { PagUsuarioDetalleEditarComponent } from './paginas/usuarios/detalle-editar/detalle-editar.component';
import { PagUsuarioIniciarSesionComponent } from './paginas/usuarios/iniciar-sesion/iniciar-sesion.component';

const routes: Routes = [
  { path: '', component: PagUsuarioIniciarSesionComponent,  pathMatch: 'full' },

  { path: 'ven', component: PagVentasVistaGeneralComponent},
  { path: 'ven/crear', component: PagVentasCrearComponent},
  { path: 'ven/detalle-editar', component: PagVentasDetalleEditarComponent},
  
  { path: 'tf', component: PagTiendaFisicaVistaGeneralComponent},
  { path: 'tf/revisar-stock', component: PagTiendaFisicaRevisarStockComponent},

  { path: 'to', component: PagTiendaOnlineVistaGeneralComponent},
  { path: 'to/revisar-stock', component: PagTiendaOnlineRevisarStockComponent},

  // { path: 'prod/detalle-editar/:id', component: PagProductosDetalleEditarComponent},
  { path: 'prod/detalle-editar', component: PagProductosDetalleEditarComponent},
  { path: 'prod/crear', component: PagProductosCrearComponent},

  { path: "mov", component: PagMovimientosVistaGeneralComponent},
  { path: "mov/crear", component: PagMovimientosCrearComponent},
  // { path: "mov/detalle", component: PagMovimientosDetalleComponent}, //* No se necesita crear un componente para el detalle de movimientos, creo que es redundante

  { path: "reg", component: PagRegalosVistaGeneralComponent},
  { path: "reg/crear", component: PagRegalosCrearComponent},
  // { path: "reg/detalle-editar/:id", component: PagRegalosDetalleEditarComponent},
  { path: "reg/detalle-editar", component: PagRegalosDetalleEditarComponent},

  { path: "gc", component: PagGiftCardsVistaGeneralComponent},
  { path: "gc/crear", component: PagGiftCardsCrearComponent},
  // { path: "gc/detalle-editar/:id", component: PagGiftCardsDetalleEditarComponent},
  { path: "gc/detalle-editar", component: PagGiftCardsDetalleEditarComponent},

  { path: "usu", component: PagUsuarioVistaGeneralComponent},
  { path: "usu/crear", component: PagUsuarioCrearComponent},
  { path: "usu/detalle-editar/:alias", component: PagUsuarioDetalleEditarComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
