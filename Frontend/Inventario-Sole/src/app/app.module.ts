import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CompNavbarComponent } from './componentes/comp-navbar/comp-navbar.component';
import { PagTiendaFisicaComponent } from './paginas/pag-tienda-fisica/pag-tienda-fisica.component';
import { CompTablaDatosComponent } from './componentes/comp-tabla-datos/comp-tabla-datos.component';
import { CompDetalleLateralComponent } from './componentes/comp-detalle-lateral/comp-detalle-lateral.component';
import { CompBusquedaComponent } from './componentes/comp-busqueda/comp-busqueda.component';
import { CompFiltroCheckboxComponent } from './componentes/comp-filtro-checkbox/comp-filtro-checkbox.component';
import { CompFiltroListaSeleccionComponent } from './componentes/comp-filtro-lista-seleccion/comp-filtro-lista-seleccion.component';
import { CompBarraLateralComponent } from './componentes/comp-barra-lateral/comp-barra-lateral.component';
import { CompDetalleCuerpoComponent } from './componentes/comp-detalle-nuevo/comp-detalle-cuerpo.component';
import { PagTiendaFisicaEditarComponent } from './paginas/pag-tienda-fisica-editar/pag-tienda-fisica-editar.component';

@NgModule({
  declarations: [
    AppComponent,
    CompNavbarComponent,
    PagTiendaFisicaComponent,
    CompTablaDatosComponent,
    CompDetalleLateralComponent,
    CompBusquedaComponent,
    CompFiltroCheckboxComponent,
    CompFiltroListaSeleccionComponent,
    CompBarraLateralComponent,
    CompDetalleCuerpoComponent,
    PagTiendaFisicaEditarComponent,
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
