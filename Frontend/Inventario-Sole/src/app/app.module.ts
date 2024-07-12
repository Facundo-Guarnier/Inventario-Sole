import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthInterceptor } from './services/auth/auth.interceptor';

//! Importar los componentes
import { AppComponent } from './app.component';
import { CompNavbarComponent } from './componentes/comp-navbar/comp-navbar.component';
import { CompTablaDatosComponent } from './componentes/comp-tabla-datos/comp-tabla-datos.component';
import { CompDetalleLateralComponent } from './componentes/comp-detalle-lateral/comp-detalle-lateral.component';
import { CompBusquedaComponent } from './componentes/comp-busqueda/comp-busqueda.component';
import { CompFiltroCheckboxComponent } from './componentes/comp-filtro-checkbox/comp-filtro-checkbox.component';
import { CompFiltroListaSeleccionComponent } from './componentes/comp-filtro-lista-seleccion/comp-filtro-lista-seleccion.component';
import { CompBarraLateralComponent } from './componentes/comp-barra-lateral/comp-barra-lateral.component';
import { CompDetalleNuevoComponent } from './componentes/comp-detalle-nuevo-prod/comp-detalle-nuevo-prod.component';
import { CompBotonesFlotantesComponent } from './componentes/comp-botones-flotantes/comp-botones-flotantes.component';
import { CompBotonFotoComponent } from './componentes/comp-boton-foto/comp-boton-foto.component';
import { CompCampoFotosComponent } from './componentes/comp-campo-fotos/comp-campo-fotos.component';
import { CompDetalleNuevoGenericoComponent } from './componentes/comp-detalle-nuevo-generico/comp-detalle-nuevo-generico.component';
import { CompVentaListaProdComponent } from './componentes/comp-venta-lista-prod/comp-venta-lista-prod.component';

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
import { PagUsuarioDetalleEditarComponent } from './paginas/usuarios/detalle-editar/detalle-editar.component';
import { PagUsuarioCrearComponent } from './paginas/usuarios/crear/crear.component';
import { CompNotificacionComponent } from './componentes/comp-notificacion/comp-notificacion.component';
import { PagUsuarioIniciarSesionComponent } from './paginas/usuarios/iniciar-sesion/iniciar-sesion.component';
import { AuthService } from './services/auth/auth.service';
import { JwtModule } from '@auth0/angular-jwt';

// Función para obtener el token del localStorage
export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,

    //! Declarar los componentes
    CompNavbarComponent,
    CompTablaDatosComponent,
    CompDetalleLateralComponent,
    CompBusquedaComponent,
    CompFiltroCheckboxComponent,
    CompFiltroListaSeleccionComponent,
    CompBarraLateralComponent,
    CompDetalleNuevoComponent,
    CompBotonesFlotantesComponent,
    CompBotonFotoComponent,
    CompCampoFotosComponent,
    CompDetalleNuevoGenericoComponent,
    CompVentaListaProdComponent,
    
    //! Declarar las paginas
    PagProductosCrearComponent,
    PagProductosDetalleEditarComponent,

    PagTiendaFisicaVistaGeneralComponent,
    PagTiendaFisicaRevisarStockComponent,

    PagTiendaOnlineVistaGeneralComponent,
    PagTiendaOnlineRevisarStockComponent,

    PagVentasCrearComponent,
    PagVentasDetalleEditarComponent,
    PagVentasVistaGeneralComponent,

    PagGiftCardsVistaGeneralComponent,
    PagGiftCardsDetalleEditarComponent,
    PagGiftCardsCrearComponent,

    PagRegalosVistaGeneralComponent, 
    PagRegalosCrearComponent,
    PagRegalosDetalleEditarComponent,

    PagMovimientosDetalleComponent,
    PagMovimientosCrearComponent,
    PagMovimientosVistaGeneralComponent,
    
    PagUsuarioVistaGeneralComponent,
    PagUsuarioDetalleEditarComponent,
    PagUsuarioCrearComponent,
    CompNotificacionComponent,
    PagUsuarioIniciarSesionComponent,

  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5000"], // Ajusta esto a tu dominio de backend
        disallowedRoutes: ["http://localhost:5000/api/auth"] // Rutas que no necesitan token
      }
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
