import { Component, OnInit, ViewChild } from '@angular/core';
import { CompDetalleNuevoGenericoComponent } from 'src/app/componentes/comp-detalle-nuevo-generico/comp-detalle-nuevo-generico.component';
import { Campo } from 'src/app/interfaces/campo.interface';
import { ApiUsuarioService, ApiUsuariosService } from '../../../services/usuarios/api-usuario.service';
import { ApiAuthService } from '../../../services/auth/api-auth.service';

@Component({
  selector: 'pag-usuario-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class PagUsuarioCrearComponent implements OnInit {

  @ViewChild(CompDetalleNuevoGenericoComponent) compDetalleNuevo!: CompDetalleNuevoGenericoComponent;

  isModalOpen = false;
  
  titulo1 = "Detalle de la usuario";
  campos1: Campo[] = [
    { nombre: "Alias", identificador: "alias", tipo: "input-text" },
    { nombre: "Roles", identificador: "roles", tipo: "selector-multiple", opciones: ["Admin", "User", "Ver y nada mas"]},
    { nombre: "Contraseña", identificador: "contraseña", tipo: "input-text"},
  ];

  detalleusuario: any[] = [];

  constructor(
    private apiUsuario: ApiUsuarioService,
    private apiUsuarios: ApiUsuariosService,
    private apiAuth: ApiAuthService,
  ) { }

  ngOnInit(): void {
  }

  //! Funciones
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  clickAceptar() {
    this.compDetalleNuevo.recolectarDatos();
    console.log("Datos a enviar:", this.detalleusuario);
  
    this.apiAuth.register(this.detalleusuario).subscribe(
      (data: any) => {
        console.log("Respuesta del servidor:", data);
      },
      (error) => {
        console.error("Error en la solicitud:", error);
      }
    );
  }

  onDatosRecolectadosUsuario(datos: any[]) {
    this.detalleusuario = datos;
  }
  

}
