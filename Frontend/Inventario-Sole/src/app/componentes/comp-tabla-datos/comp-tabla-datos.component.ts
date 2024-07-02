import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comp-tabla-datos',
  templateUrl: './comp-tabla-datos.component.html',
  styleUrls: ['./comp-tabla-datos.component.css']
})
export class CompTablaDatosComponent implements OnInit {

  @Input() productos: any; 
  cdRef: any;
  
  constructor() { }

  ngOnInit(): void {
    this.productos = [
      {
        "idProducto": "AB120",
        "marca": "Adidas",
        "descripcion": "Pantalón negro deportivo",
        "talle": "M",
        "precio": 80000,
        "cantidad": 12,
        "liquidacion": true,
      },
      {
        "idProducto": "AB121",
        "marca": "Nike",
        "descripcion": "Remera azul deportiva",
        "talle": "M",
        "precio": 45000,
        "cantidad": 7,
        "liquidacion": true,
      },
      {
        "idProducto": "AB122",
        "marca": "AAA",
        "descripcion": "Remera deportiva Remera azul deportiva Remera  asd asd ada dasd ad aazul  a sda  asd asd 151 81 562deportiva Remera azul deportiva",
        "talle": "XL",
        "precio": 900000,
        "cantidad": 2,
        "liquidacion": false,
      },
      {
        "idProducto": "AB123",
        "marca": "Adidas",
        "descripcion": "Campera",
        "talle": "M",
        "precio": 10000,
        "cantidad": 1,
        "liquidacion": true,
      },
    ]
  }

}
