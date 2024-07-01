import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//! Componentes
import { AppComponent } from './app.component';

//! Páginas
import { AppPagTiendaFisicaComponent } from './paginas/app-pag-tienda-fisica/app-pag-tienda-fisica.component';


@NgModule({
    declarations: [
        //! Componentes
        AppComponent,
        
        //! Páginas
        AppPagTiendaFisicaComponent,
    ],
    imports: [
        BrowserModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }