import { Component, OnInit } from '@angular/core';

// import { CompBotonesFlotantesComponent } from '../../componentes/comp-botones-flotantes/comp-botones-flotantes.component';

@Component({
  selector: 'pag-tienda-fisica-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})

export class PagTiendaFisicaVistaGeneralComponent implements OnInit {

  ClickAceptar() {
    //! Lógica para el botón "aceptar"
    console.log('Botón "aceptar" presionado');
  }
  
  ClickCancelar() {
    //! Lógica para el botón "cancelar"
    console.log('Botón "cancelar" presionado');
  }
  
  ClickBorrar() {
    //! Lógica para el botón "borrar"
    console.log('Botón "borrar" presionado');
  }

  ClickAgregar() {
    //! Lógica para el botón "agregar"
    console.log('Botón "agregar" presionado');
  }


  columnasProductos = [
    { nombre: 'ID producto', tipo: 'text' },
    { nombre: 'Marca', tipo: 'text' },
    { nombre: 'Descripción', tipo: 'text' },
    { nombre: 'Talle', tipo: 'text' },
    { nombre: 'Precio', tipo: 'currency' },
    { nombre: 'Cantidad', tipo: 'number' },
    { nombre: 'Liquidación', tipo: 'boolean' }
  ];

  accionesProductos = {
    editar: true,
    eliminar: true,
    detalle: true
  }
  
  productos: any[] = [
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
    
    
    //! Botones flotantes
    declarations: [
      // CompBotonesFlotantesComponent, 
    ]
  }

}
