import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pag-gift-cards-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})
export class PagGiftCardsVistaGeneralComponent implements OnInit {
  //! NavBar
  pagActual = 'gc';

  //! Tabla de datos
  acciones = {
    editar: true,
    eliminar: true,
    detalle: true
  };

  columnas = [
    { nombre: 'ID gif card', identificador: '', tipo: 'text' },
    { nombre: 'Cliente', identificador: '', tipo: 'text' },
    { nombre: 'Fecha', identificador: '', tipo: 'date' },
    { nombre: 'Monto', identificador: '', tipo: 'number' },
    { nombre: 'Metodo', identificador: '', tipo: 'number' },
    { nombre: 'Canjeado', identificador: '', tipo: 'boolean' }
  ];

  datos: any[] = [
    {
      'ID gif card': 'AB12C',
      Cliente: 'Juan Perez',
      Fecha: '2021-10-21',
      Monto: '10000',
      Metodo: 'Mercado Pago',
      Canjeado: false
    },
    {
      'ID gif card': 'AB12D',
      Cliente: 'Maria Rodriguez',
      Fecha: '2021-10-02',
      Monto: '20000',
      Metodo: 'Tarjeta y efectivo',
      Canjeado: true
    },
    {
      'ID gif card': 'AB12E',
      Cliente: 'Jose Gomez',
      Fecha: '2021-10-03',
      Monto: '30000',
      Metodo: 'Efectivo',
      Canjeado: false
    },
    {
      'ID gif card': 'AB12F',
      Cliente: 'Ana Martinez',
      Fecha: '2021-10-04',
      Monto: '40000',
      Metodo: 'Tarjeta',
      Canjeado: true
    }
  ];

  ClickAgregar() {
    this.router.navigate(['gc/crear']);
  }

  constructor(private router: Router) {}

  ngOnInit(): void {}
}
