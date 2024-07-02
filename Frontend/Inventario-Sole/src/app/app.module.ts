import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CompNavbarComponent } from './componentes/comp-navbar/comp-navbar.component';
import { PagTiendaFisicaComponent } from './paginas/pag-tienda-fisica/pag-tienda-fisica.component';
import { CompTablaDatosComponent } from './componentes/comp-tabla-datos/comp-tabla-datos.component';
import { CompDetalleComponent } from './componentes/comp-detalle/comp-detalle.component';
import { CompBusquedaComponent } from './componentes/comp-busqueda/comp-busqueda.component';
import { CompFiltroCheckboxComponent } from './componentes/comp-filtro-checkbox/comp-filtro-checkbox.component';
import { CompFiltroListaSeleccionComponent } from './componentes/comp-filtro-lista-seleccion/comp-filtro-lista-seleccion.component';

@NgModule({
  declarations: [
    AppComponent,
    CompNavbarComponent,
    PagTiendaFisicaComponent,
    CompTablaDatosComponent,
    CompDetalleComponent,
    CompBusquedaComponent,
    CompFiltroCheckboxComponent,
    CompFiltroListaSeleccionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
