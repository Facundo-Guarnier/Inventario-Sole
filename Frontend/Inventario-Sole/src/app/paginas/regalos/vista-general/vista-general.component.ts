import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pag-regalos-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})
export class PagRegalosVistaGeneralComponent implements OnInit {

  pagActual = 'reg';

  acciones = {
    editar: true,
    eliminar: true,
    detalle: true
  }

  columnas = [
    { nombre: 'ID regalo', tipo: 'text' },
    { nombre: 'Cliente', tipo: 'text' },
    { nombre: 'Fecha', tipo: 'date' },
    { nombre: 'Total', tipo: 'currency' },
    { nombre: 'Metodo', tipo: 'text' }
  ];
  
  datos = [
    { 
      "ID regalo": "AB120",
      "Cliente": "Juan Perez",
      "Fecha": "2021-10-20",
      "Total": 89000,
      "Metodo": "Efectivo"
    },
    { 
      "ID regalo": "AB121",
      "Cliente": "Maria Rodriguez",
      "Fecha": "2021-10-21",
      "Total": 45000,
      "Metodo": "Tarjeta"
    },
    { 
      "ID regalo": "AB122",
      "Cliente": "Jose Gomez",
      "Fecha": "2021-10-22",
      "Total": 900000,
      "Metodo": "Efectivo"
    },
    { 
      "ID regalo": "AB123",
      "Cliente": "Ana Martinez",
      "Fecha": "2021-10-23",
      "Total": 50000,
      "Metodo": "Tarjeta"
    }
  ]

  ClickAgregar(){
    console.log("Click en agregar");
  };

  constructor() { }

  ngOnInit(): void {
  }

}
