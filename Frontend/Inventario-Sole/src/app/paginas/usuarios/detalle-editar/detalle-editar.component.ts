import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CompDetalleNuevoGenericoComponent } from 'src/app/componentes/comp-detalle-nuevo-generico/comp-detalle-nuevo-generico.component';
import { Campo } from 'src/app/interfaces/campo.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiUsuarioService, ApiUsuariosService } from 'src/app/services/usuarios/api-usuario.service';


@Component({
  selector: 'pag-usuario-detalle-editar',
  templateUrl: './detalle-editar.component.html',
  styleUrls: ['./detalle-editar.component.css']
})

export class PagUsuarioDetalleEditarComponent implements OnInit {
  
  //! Ver los componentes hijos
  @ViewChild(CompDetalleNuevoGenericoComponent) compDetalleNuevo!: CompDetalleNuevoGenericoComponent;
  
  //! Datos
  alias = this.router.url.split("?")[0].split('/').pop();
  titulo1 = "Detalle del usario";
  campos1: Campo[] = [
    { nombre: "Alias (no editable)", identificador: "alias", tipo: "readonly", valor: this.alias},
    { nombre: "Roles (obligatorio)", identificador: "roles", tipo: "selector-multiple", opciones: ["Admin", "User", "Ver y nada mas"]},
    { nombre: "Nueva contraseña (si no desea cambiarla deje el campo vacío)", identificador: "contraseña", tipo: "input-text"},
  ];
  detalleUsuario: any[] = [];
  
  //! Modal
  estaAbierto = false;
  tituloModal = "titulo";
  mensajeModal = "mensaje";
  redireccionar: boolean = false;
  
  //! Botones flotantes
  mostrarBorrar = true;
  mostrarAceptar = true;
  mostrarCancelar = true;
  
  //* ------------------------------------------------------------
  
  constructor(
    private apiUsuario: ApiUsuarioService,
    private apiUsuarios: ApiUsuariosService,
    private authService: AuthService,
    private router: Router,
  ) { }
  
  ngOnInit(): void {
  }
  
  //T* Funciones
  //! Boton flotante
  clickAceptar() {
    this.compDetalleNuevo.recolectarDatos();
    
    if (this.alias === undefined) {
      console.error("No se pudo obtener el alias del usuario")
      return 
    }
    
    this.apiUsuario.editar(this.alias, this.detalleUsuario, localStorage.getItem("token")).subscribe(
      (data: any) => {
        console.log("Respuesta del servidor:", data);
        this.tituloModal = "Usuario editado"
        this.mensajeModal = "El usuario ha sido editado correctamente"
        this.redireccionar = true;
        this.openModal()
      },
      (error) => {
        console.error("Error en la solicitud:", error);
        this.tituloModal = "Error al editar"
        this.mensajeModal = "No se pudo editar el usuario."
        this.openModal()
      }
    );
  }
  
  //! Modal
  openModal() {
    this.estaAbierto = true;
  }
  cerrarModal() {
    this.estaAbierto = false;
    if (this.redireccionar) {
      this.router.navigate(['/usu']);
    }
  }
  
  //! Recibir datos del componente hijo
  onDatosRecolectadosUsuario(datos: any[]) {
    this.detalleUsuario = datos;
  }
}
