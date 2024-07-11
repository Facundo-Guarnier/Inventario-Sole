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
    { nombre: "Roles", identificador: "roles", tipo: "selector-multiple", opciones: ["Admin", "User", "Ver y nada mas"]},
    { nombre: "Nueva contraseña (si no desea cambiarla deje el campo vacío)", identificador: "contraseña", tipo: "input-text"},
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
