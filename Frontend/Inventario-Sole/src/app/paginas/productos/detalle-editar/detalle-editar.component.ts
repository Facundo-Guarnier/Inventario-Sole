import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pag-productos-editar',
  templateUrl: './detalle-editar.component.html',
  styleUrls: ['./detalle-editar.component.css']
})
export class PagProductosDetalleEditarComponent implements OnInit {

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
