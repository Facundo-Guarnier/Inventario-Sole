import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pag-productos-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class PagProductosCrearComponent implements OnInit {


  ClickAceptar() {
    console.log('Click en Aceptar');
  }

  ClickCancelar() {
    console.log('Click en Cancelar');
  }

  ClickAgregarFoto() {
    console.log('Click en Agregar Foto');
  }


  constructor() { }

  ngOnInit(): void {
  }

}
