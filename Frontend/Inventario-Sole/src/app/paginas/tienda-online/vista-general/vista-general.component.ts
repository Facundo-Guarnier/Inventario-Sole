import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pag-tienda-fisica-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})
export class PagTiendaOnlineVistaGeneralComponent implements OnInit {
  
  //! NavBar
  pagActual = 'to';

  //! Tabla de datos
  acciones = {
    editar: true,
    eliminar: true,
    detalle: true
  }

  columnas = [
    { nombre: 'ID producto', tipo: 'text' },
    { nombre: 'Marca', tipo: 'text' },
    { nombre: 'Descripción', tipo: 'text' },
    { nombre: 'Talle', tipo: 'text' },
    { nombre: 'Precio', tipo: 'currency' },
    { nombre: 'Cantidad', tipo: 'number' },
  ];

  datos: any[] = [
    {
      "ID producto": "AB120",
      "Marca": "Adidas",
      "Descripción": "Pantalon blanco deportivo con rayas negras",
      "Talle": "M",
      "Precio": 89000,
      "Cantidad": 50,
    }, 
    {
      "ID producto": "AB121",
      "Marca": "Nike",
      "Descripción": "Remera azul deportiva",
      "Talle": "M",
      "Precio": 45000,
      "Cantidad": 7,
    },
    {
      "ID producto": "AB122",
      "Marca": "AAA",
      "Descripción": "Remera deportiva Remera azul deportiva Remera  asd asd ada dasd ad aazul  a sda  asd asd 151 81 562deportiva Remera azul deportiva",
      "Talle": "XL",
      "Precio": 900000,
      "Cantidad": 2,
    },
    {
      "ID producto": "AB123",
      "Marca": "Adidas",
      "Descripción": "Campera",
      "Talle": "M",
      "Precio": 10000,
      "Cantidad": 1,
    }
  ];
  
  //! Botones flotantes
  ClickAgregar(){
    console.log("Click en agregar");
  };
  
  
  constructor() { }
  
  ngOnInit(): void {
  }

}