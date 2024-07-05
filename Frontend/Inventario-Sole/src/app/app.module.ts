import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

//! Importar los componentes
import { AppComponent } from './app.component';
import { CompNavbarComponent } from './componentes/comp-navbar/comp-navbar.component';
import { CompTablaDatosComponent } from './componentes/comp-tabla-datos/comp-tabla-datos.component';
import { CompDetalleLateralComponent } from './componentes/comp-detalle-lateral/comp-detalle-lateral.component';
import { CompBusquedaComponent } from './componentes/comp-busqueda/comp-busqueda.component';
import { CompFiltroCheckboxComponent } from './componentes/comp-filtro-checkbox/comp-filtro-checkbox.component';
import { CompFiltroListaSeleccionComponent } from './componentes/comp-filtro-lista-seleccion/comp-filtro-lista-seleccion.component';
import { CompBarraLateralComponent } from './componentes/comp-barra-lateral/comp-barra-lateral.component';
import { CompDetalleNuevoComponent } from './componentes/comp-detalle-nuevo/comp-detalle-nuevo.component';
import { CompBotonesFlotantesComponent } from './componentes/comp-botones-flotantes/comp-botones-flotantes.component';


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
    
    //! Declarar las paginas
    PagProductosCrearComponent,
    PagProductosDetalleEditarComponent,

    PagTiendaFisicaVistaGeneralComponent,
    PagTiendaOnlineVistaGeneralComponent,

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
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
