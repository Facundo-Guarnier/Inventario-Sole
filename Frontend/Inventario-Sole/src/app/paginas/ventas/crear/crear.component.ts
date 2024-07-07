import { Component, OnInit, ViewChild } from '@angular/core';
import { CompDetalleNuevoGenericoComponent } from 'src/app/componentes/comp-detalle-nuevo-generico/comp-detalle-nuevo-generico.component';
import { Campo } from 'src/app/interfaces/campo.interface';

@Component({
  selector: 'pag-ventas-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class PagVentasCrearComponent implements OnInit {
  @ViewChild(CompDetalleNuevoGenericoComponent) compDetalleNuevo!: CompDetalleNuevoGenericoComponent;

  titulo1 = "Detalle de la venta";
  campos1: Campo[] = [
    { nombre: "Cliente", identificador: "cliente", tipo: "input-text" },
    { nombre: "Tienda", identificador: "tienda", tipo: "selector", opciones: ["Fisica", "Online"] },
    { nombre: "Método", identificador: "metodo", tipo: "textarea-text"},
    { nombre: "Comentario", identificador: "comentario", tipo: "textarea-text"}
  ];

  titulo2 = "Productos";
  campos2: Campo[] = [
    { nombre: "ID producto", identificador: "idProducto", tipo: "input-text" },
    { nombre: "Cantidad", identificador: "cantidad", tipo: "input-number" },
    { nombre: "Precio", identificador: "precio", tipo: "input-number" },
    { nombre: "Comentario", identificador: "comentario", tipo: "textarea-text"}
  ];

  productos: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  clickAceptar() {
    this.compDetalleNuevo.recolectarDatos();
  }

  onDatosRecolectados(datos: any[]) {
    console.log('Datos recibidos del hijo:', datos);
    this.productos = datos;
    // Aquí puedes procesar los datos como necesites
  }
}
