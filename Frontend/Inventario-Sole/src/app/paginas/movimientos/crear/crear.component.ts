import { Component, OnInit } from '@angular/core';
import { Campo } from '../../../interfaces/campo.interface'

@Component({
  selector: 'pag-movimientos-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class PagMovimientosCrearComponent implements OnInit {

  campos: Campo[] = [
    { nombre: "ID producto", identificador: "idProducto", tipo: "input-text" },
    { nombre: "Cantidad", identificador: "cantidad", tipo: "input-number" },
    { nombre: "Precio", identificador: "precio", tipo: "input-number" },
    { nombre: "Comentario", identificador: "comentario", tipo: "textarea-text"}
  ];

  constructor() { }

  ngOnInit(): void {
  }
}