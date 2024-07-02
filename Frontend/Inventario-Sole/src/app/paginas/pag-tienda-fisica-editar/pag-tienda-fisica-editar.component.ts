import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pag-tienda-fisica-editar',
  templateUrl: './pag-tienda-fisica-editar.component.html',
  styleUrls: ['./pag-tienda-fisica-editar.component.css']
})
export class PagTiendaFisicaEditarComponent implements OnInit {

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
  }

}
