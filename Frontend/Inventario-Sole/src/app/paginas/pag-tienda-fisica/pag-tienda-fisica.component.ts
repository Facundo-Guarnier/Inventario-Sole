import { Component, OnInit } from '@angular/core';

import { CompBotonesFlotantesComponent } from '../../componentes/comp-botones-flotantes/comp-botones-flotantes.component';

@Component({
  selector: 'app-pag-tienda-fisica',
  templateUrl: './pag-tienda-fisica.component.html',
  styleUrls: ['./pag-tienda-fisica.component.css']
})

export class PagTiendaFisicaComponent implements OnInit {

  ClickAceptar() {
    //! Lógica para el botón "aceptar"
    console.log('Botón "aceptar" presionado');
  }
  
  ClickCancelar() {
    //! Lógica para el botón "cancelar"
    console.log('Botón "cancelar" presionado');
  }
  
  ClickBorrar() {
    //! Lógica para el botón "borrar"
    console.log('Botón "borrar" presionado');
  }

  ClickAgregar() {
    //! Lógica para el botón "agregar"
    console.log('Botón "agregar" presionado');
  }

  constructor() { }

  ngOnInit(): void {
    
    //! Botones flotantes
    declarations: [
      CompBotonesFlotantesComponent 
    ]
  }

}
