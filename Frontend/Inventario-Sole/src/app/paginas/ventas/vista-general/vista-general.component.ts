import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pag-ventas-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})
export class PagVentasVistaGeneralComponent implements OnInit {
  
  //! NavBar
  pagActual = 'ven';

  //! Tabla de datos
  acciones = {
    editar: true,
    eliminar: true,
    detalle: true
  }

  columnas = [
    { nombre: 'ID venta', tipo: 'text' },
    { nombre: 'Cliente', tipo: 'text' },
    { nombre: 'Fecha', tipo: 'date' },
    { nombre: 'Total', tipo: 'number' },
    { nombre: 'Tienda', tipo: 'text' },
    { nombre: 'Metodo', tipo: 'number' },
  ];

  datos: any[] = [
    {
      "ID venta": "AB12C",
      "Cliente": "Juan Perez",
      "Fecha": "2021-10-01",
      "Total": "10000",
      "Tienda": "Online",
      "Metodo": "Mercado Pago"
    },
    {
      "ID venta": "AB12D",
      "Cliente": "Maria Rodriguez",
      "Fecha": "2021-10-02",
      "Total": "20000",
      "Tienda": "Fisica",
      "Metodo": "Tarjeta y efectivo"
    },
    {
      "ID venta": "AB12E",
      "Cliente": "Jose Gomez",
      "Fecha": "2021-10-03",
      "Total": "30000",
      "Tienda": "Fisica",
      "Metodo": "Efectivo"
    },
    {
      "ID venta": "AB12F",
      "Cliente": "Ana Martinez",
      "Fecha": "2021-10-04",
      "Total": "40000",
      "Tienda": "Fisica",
      "Metodo": "Tarjeta"
    }
    
    
  ];
  
  
  //! Botones flotantes
  ClickAgregar(){
    this.router.navigate(['ven/crear']);
  };

  
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}