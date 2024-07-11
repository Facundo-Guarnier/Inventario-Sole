import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pag-movimientos-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})
export class PagMovimientosVistaGeneralComponent implements OnInit {

  pagActual = 'mov';

  columnas = [
    { nombre: 'Movimiento', identificador: "", tipo: 'text' },
    { nombre: 'Fecha', identificador: "", tipo: 'date' },
    { nombre: "Producto ID", identificador: "", tipo: "text" },
    { nombre: "Cantidad", identificador: "", tipo: "number" },
    { nombre: "Vendedor", identificador: "", tipo: "text" },
    { nombre: "Comentario", identificador: "", tipo: "text" },
  ];

  acciones = {
    editar: false,
    eliminar: false,
    detalle: false
  }
  
  datos: any[] = [
    {
      "Movimiento": "Entrada",
      "Fecha": "2021-10-01",
      "Producto ID": "AB12C",
      "Cantidad": 2,
      "Vendedor": "Chica 1",
      "Comentario": "Compra de 1 unidad"
    },
    {
      "Movimiento": "Salida",
      "Fecha": "2021-10-02",
      "Producto ID": "AB12D",
      "Cantidad": 3,
      "Vendedor": "Chica 1",
      "Comentario": "Venta de 3 unidades"
    },
    {
      "Movimiento": "Entrada",
      "Fecha": "2021-10-03",
      "Producto ID": "AB12E",
      "Cantidad": 1,
      "Vendedor": "Chica 2",
      "Comentario": "Compra de 1 unidad"
    },
    {
      "Movimiento": "Salida",
      "Fecha": "2021-10-04",
      "Producto ID": "AB12F",
      "Cantidad": 4,
      "Vendedor": "Chica 1",
      "Comentario": "Venta de 4 unidades"
    }
    
  ];


  ClickAgregar(){
    this.router.navigate(['mov/crear']);
  }

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}
