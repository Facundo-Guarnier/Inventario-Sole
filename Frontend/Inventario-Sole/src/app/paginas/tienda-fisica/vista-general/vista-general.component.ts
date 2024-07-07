import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// import { CompBotonesFlotantesComponent } from '../../componentes/comp-botones-flotantes/comp-botones-flotantes.component';

@Component({
  selector: 'pag-tienda-fisica-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})

export class PagTiendaFisicaVistaGeneralComponent implements OnInit {

  pagActual = 'tf';

  ClickAgregar() {
    //! Lógica para el botón "agregar"
    this.router.navigate(['prod/crear']);
  }


  columnas = [
    { nombre: 'ID producto', tipo: 'text' },
    { nombre: 'Marca', tipo: 'text' },
    { nombre: 'Descripción', tipo: 'text' },
    { nombre: 'Talle', tipo: 'text' },
    { nombre: 'Precio', tipo: 'currency' },
    { nombre: 'Cantidad', tipo: 'number' },
    { nombre: 'Liquidación', tipo: 'boolean' }
  ];

  acciones = {
    editar: true,
    eliminar: false,
    detalle: true
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



  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    
    
    
    //! Botones flotantes
    declarations: [
      // CompBotonesFlotantesComponent, 
    ]
  }

}
