import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comp-detalle-cuerpo',
  templateUrl: './comp-detalle-nuevo.component.html',
  styleUrls: ['./comp-detalle-nuevo.component.css']
})
export class CompDetalleNuevoComponent implements OnInit {
    producto: any = {
      id: '',
      codMS: '',
      marca: '',
      descripcion: '',
      talle: '',
      liquidacion: false,
      precioFisico: 0,
      cantidadFisica: 0,
      precioOnline: 0,
      cantidadOnline: 0
    };
  constructor() { }

  ngOnInit(): void {
  }

}
