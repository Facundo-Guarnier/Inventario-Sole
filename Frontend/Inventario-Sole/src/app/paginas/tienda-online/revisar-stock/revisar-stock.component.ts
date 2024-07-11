import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pag-tienda-online-revisar-stock',
  templateUrl: './revisar-stock.component.html',
  styleUrls: ['./revisar-stock.component.css']
})
export class PagTiendaOnlineRevisarStockComponent implements OnInit {
  columnas = [
    { nombre: 'ID producto', identificador: "", tipo: 'text' },
    { nombre: 'Marca', identificador: "", tipo: 'text' },
    { nombre: 'Descripción', identificador: "", tipo: 'text' },
    { nombre: 'Talle', identificador: "", tipo: 'text' },
    { nombre: 'Cantidad', identificador: "", tipo: 'number' },
  ];

  acciones = {
    editar: false,
    eliminar: false,
    detalle: false
  }
  
  datos: any[] = [
    {
      "ID producto": "AB120",
      "Marca": "Adidas",
      "Descripción": "Pantalon blanco deportivo con rayas negras",
      "Talle": "M",
      "Precio": 89000,
      "Cantidad": 50,
      "Liquidación": false
    }, 
    {
      "ID producto": "AB121",
      "Marca": "Nike",
      "Descripción": "Remera azul deportiva",
      "Talle": "M",
      "Precio": 45000,
      "Cantidad": 7,
      "Liquidación": true
    },
    {
      "ID producto": "AB122",
      "Marca": "AAA",
      "Descripción": "Remera deportiva Remera azul deportiva Remera  asd asd ada dasd ad aazul  a sda  asd asd 151 81 562deportiva Remera azul deportiva",
      "Talle": "XL",
      "Precio": 900000,
      "Cantidad": 2,
      "Liquidación": false
    },
    {
      "ID producto": "AB123",
      "Marca": "Adidas",
      "Descripción": "Campera",
      "Talle": "M",
      "Precio": 10000,
      "Cantidad": 1,
      "Liquidación": true
    }
    
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
