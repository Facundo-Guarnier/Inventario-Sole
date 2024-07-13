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
  titulo1 = "Detalle del usario";
  campos1: Campo[] = [
    { nombre: "Alias (no editable)", identificador: "alias", tipo: "readonly"},
    { nombre: "Roles (obligatorio)", identificador: "roles", tipo: "selector-multiple", opciones: ["Admin", "User", "Ver y nada mas"]},
    { nombre: "Nueva contraseña (si no desea cambiarla deje el campo vacío)", identificador: "contraseña", tipo: "input-text"},
  ];
  nuevoDetalleUsuario: any[] = [];
  usuarioActual: any = {};
  
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
    let alias = this.router.url.split("?")[0].split('/').pop();
    if (alias === undefined) {
      console.error("No se pudo obtener el alias del usuario")
      this.router.navigate(['/usu']);
      return;
    }
    this.apiUsuario.buscar_x_id(alias, this.authService.getToken()).subscribe(
      (data: any) => {
        this.usuarioActual = data;
        this.nuevoDetalleUsuario = [
          { nombre: "alias", valor: data.alias },
          { nombre: "roles", valor: data.roles },
        ]
        this.campos1[0].valor = this.usuarioActual.alias;
        this.campos1[1].seleccionados = this.usuarioActual.roles;
      },
      (error) => {
        console.error("Error en la solicitud:", error);
        this.tituloModal = "Error al cargar el usuario"
        this.mensajeModal = "No se pudo cargar el usuario."
        this.redireccionar = true;
        this.openModal()
      }
    );
  }
  
  //T* Funciones
  //! Boton flotante
  clickAceptar() {
    //! Obtener los datos de los componentes hijos
    this.compDetalleNuevo.recolectarDatos();
    
    //! Revisar si hay campos vacíos
    let optionalFields = ['contraseña'];
    
    if (this.hasEmptyFields(this.nuevoDetalleUsuario, optionalFields)) {
      this.tituloModal = "Error al crear la venta"
      this.mensajeModal = "No se pudo crear la venta. Revise los campos e intente de nuevo."
      this.openModal()
      console.error("Hay campos vacíos.");
      return;
    }
    
    this.apiUsuario.editar(this.usuarioActual.alias, this.nuevoDetalleUsuario, localStorage.getItem("token")).subscribe(
      (data: any) => {
        this.tituloModal = "Usuario editado"
        this.mensajeModal = "El usuario ha sido editado correctamente."
        this.redireccionar = true;
        this.openModal()
      },
      (error) => {
        console.error("Error en la solicitud:", error);
        this.tituloModal = "Error al editar"
        this.mensajeModal = "No se pudo editar el usuario. Revise los campos e intente de nuevo."
        this.openModal()
      }
    );
  }
  clickCancelar() {
    this.router.navigate(['/usu']);
  }
  
  //! Revisar si hay campos vacíos
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
  }
  hasEmptyFields(obj: any, optionalFields: string[] = []): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        //! Campo "Comentario" es opcional
        if (optionalFields.includes(key)) {
          continue;
        }
        
        if (typeof value === 'object' && !Array.isArray(value)) {
          if (this.hasEmptyFields(value, optionalFields)) {
            return true;
          }
        
        } else if (Array.isArray(value)) {
          
          //! Lista vacía
          if (value.length === 0) {
            return true;
          }
          
          for (const item of value) {
            if (typeof item === 'object') {
              if (this.hasEmptyFields(item, optionalFields)) {
                return true;
              }
            
            } else if (this.isEmpty(item)) {
              return true;
            }
            
          }
        } else if (this.isEmpty(value)) {
          return true;
        }
      }
    }
    return false;
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
    this.nuevoDetalleUsuario = datos;
  }
}
