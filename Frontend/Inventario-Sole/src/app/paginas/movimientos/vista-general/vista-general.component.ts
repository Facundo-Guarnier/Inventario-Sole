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
    { nombre: 'Movimiento', tipo: 'text' },
    { nombre: 'Fecha', tipo: 'date' },
    { nombre: "Producto ID", tipo: "text" },
    { nombre: "Vendedor", tipo: "text" },
    { nombre: "Aclaraciones", tipo: "text" },
  ];

  acciones = {
    editar: false,
    eliminar: false,
    detalle: true
  }
  
  datos: any[] = [
    {
      "Movimiento": "Entrada",
      "Fecha": "2021-10-01",
      "Producto ID": "AB12C",
      "Vendedor": "Chica 1",
      "Aclaraciones": "Compra de 100 unidades"
    },
    {
      "Movimiento": "Salida",
      "Fecha": "2021-10-02",
      "Producto ID": "AB12D",
      "Vendedor": "Chica 1",
      "Aclaraciones": "Venta de 200 unidades"
    },
    {
      "Movimiento": "Entrada",
      "Fecha": "2021-10-03",
      "Producto ID": "AB12E",
      "Vendedor": "Chica 2",
      "Aclaraciones": "Compra de 300 unidades"
    },
    {
      "Movimiento": "Salida",
      "Fecha": "2021-10-04",
      "Producto ID": "AB12F",
      "Vendedor": "Chica 1",
      "Aclaraciones": "Venta de 400 unidades"
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
