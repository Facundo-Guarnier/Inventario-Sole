import { Component, OnInit, ViewChild } from '@angular/core';
import { CompDetalleNuevoGenericoComponent } from 'src/app/componentes/comp-detalle-nuevo-generico/comp-detalle-nuevo-generico.component';
import { Campo } from 'src/app/interfaces/campo.interface';

@Component({
  selector: 'pag-usuario-detalle-editar',
  templateUrl: './detalle-editar.component.html',
  styleUrls: ['./detalle-editar.component.css']
})
export class PagUsuarioDetalleEditarComponent implements OnInit {

  @ViewChild(CompDetalleNuevoGenericoComponent) compDetalleNuevo!: CompDetalleNuevoGenericoComponent;

  titulo1 = "Detalle del usario";
  campos1: Campo[] = [
    { nombre: "Alias", identificador: "alias", tipo: "input-text" },
    { nombre: "Roles", identificador: "roles", tipo: "selector-multiple", opciones: ["Admin", "User", "Ver y nada mas"] },
    { nombre: "Nueva contraseña (si no desea cambiarla deje el campo vacío)", identificador: "nueva_contraseña", tipo: "input-text"},
  ];


  productos: any[] = [];
  detalleventa: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  clickAceptar() {
    this.compDetalleNuevo.recolectarDatos();
  }

  onDatosRecolectadosVenta(datos: any[]) {
    console.log('Datos recibidos del hijo detalle venta:', datos);
    this.detalleventa = datos;
    // Aquí puedes procesar los datos como necesites
  }
  
  onDatosRecolectadosProductos(datos: any[]) {
    console.log('Datos recibidos del hijo productos:', datos);
    this.productos = datos;
    // Aquí puedes procesar los datos como necesites
  }


}
