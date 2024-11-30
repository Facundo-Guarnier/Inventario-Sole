import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './services/auth/auth.guard';
import { AdminGuard } from './services/auth/admin.guard';

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

import { PagDevolucionesVistaGeneralComponent } from './paginas/devoluciones/vista-general/vista-general.component';
import { PagDevolucionesCrearComponent } from './paginas/devoluciones/crear/crear.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: PagUsuarioIniciarSesionComponent },

  {
    path: 'ven',
    component: PagVentasVistaGeneralComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ven/crear',
    component: PagVentasCrearComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ven/detalle-editar/:id',
    component: PagVentasDetalleEditarComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'tf',
    component: PagTiendaFisicaVistaGeneralComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tf/revisar-stock',
    component: PagTiendaFisicaRevisarStockComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: 'to',
    component: PagTiendaOnlineVistaGeneralComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'to/revisar-stock',
    component: PagTiendaOnlineRevisarStockComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'prod/crear',
    component: PagProductosCrearComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'prod/detalle-editar/:id',
    component: PagProductosDetalleEditarComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'mov',
    component: PagMovimientosVistaGeneralComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'mov/crear',
    component: PagMovimientosCrearComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  // { path: "mov/detalle", component: PagMovimientosDetalleComponent}, //* No se necesita crear un componente para el detalle de movimientos, creo que es redundante

  {
    path: 'reg',
    component: PagRegalosVistaGeneralComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reg/crear',
    component: PagRegalosCrearComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reg/detalle-editar/:id',
    component: PagRegalosDetalleEditarComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'gc',
    component: PagGiftCardsVistaGeneralComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'gc/crear',
    component: PagGiftCardsCrearComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'gc/detalle-editar/:id',
    component: PagGiftCardsDetalleEditarComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'usu',
    component: PagUsuarioVistaGeneralComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'usu/crear',
    component: PagUsuarioCrearComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'usu/detalle-editar/:alias',
    component: PagUsuarioDetalleEditarComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: 'dev',
    component: PagDevolucionesVistaGeneralComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dev/crear',
    component: PagDevolucionesCrearComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', redirectTo: '/mov' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
