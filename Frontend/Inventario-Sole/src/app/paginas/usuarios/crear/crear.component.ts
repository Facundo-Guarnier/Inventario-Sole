import { Component, OnInit, ViewChild } from '@angular/core';
import { CompDetalleNuevoGenericoComponent } from 'src/app/componentes/comp-detalle-nuevo-generico/comp-detalle-nuevo-generico.component';
import { Campo } from 'src/app/interfaces/campo.interface';

@Component({
  selector: 'pag-usuario-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class PagUsuarioCrearComponent implements OnInit {

  @ViewChild(CompDetalleNuevoGenericoComponent) compDetalleNuevo!: CompDetalleNuevoGenericoComponent;

  titulo1 = "Detalle de la usuario";
  campos1: Campo[] = [
    { nombre: "Alias", identificador: "alias", tipo: "input-text" },
    { nombre: "Roles", identificador: "roles", tipo: "selector-multiple", opciones: ["Admin", "User", "Ver y nada mas"], seleccionado: ["Admin", "User"]},
    { nombre: "Contraseña", identificador: "nueva_contraseña", tipo: "input-text"},
  ];

  detalleusuario: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  clickAceptar() {
    this.compDetalleNuevo.recolectarDatos();
  }

  onDatosRecolectadosUsuario(datos: any[]) {
    this.detalleusuario = datos;
    // Aquí puedes procesar los datos como necesites
  }
  

}
