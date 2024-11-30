import { Component, OnInit, ViewChild } from '@angular/core';
import { CompDetalleNuevoGenericoComponent } from 'src/app/componentes/comp-detalle-nuevo-generico/comp-detalle-nuevo-generico.component';
import { Campo } from 'src/app/interfaces/campo.interface';
import {
  ApiUsuarioService,
  ApiUsuariosService,
} from '../../../services/usuarios/api-usuario.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pag-usuario-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css'],
})
export class PagUsuarioCrearComponent implements OnInit {
  //! Ver los componentes hijos
  @ViewChild(CompDetalleNuevoGenericoComponent)
  compDetalleNuevo!: CompDetalleNuevoGenericoComponent;

  //! Datos para el detalle de la usuario
  titulo1 = 'Detalle de la usuario';
  campos1: Campo[] = [
    { nombre: 'Alias', identificador: 'alias', tipo: 'input-text' },
    {
      nombre: 'Roles',
      identificador: 'roles',
      tipo: 'selector-multiple',
      opciones: ['Admin', 'User'],
    },
    { nombre: 'Contraseña', identificador: 'contraseña', tipo: 'input-text' },
  ];
  detalleUsuario: any[] = [];

  //! Modal
  estaAbierto = false;
  tituloModal = 'titulo';
  mensajeModal = 'mensaje';
  redireccionar: boolean = false;

  //! Vista
  showNavbar = false;
  showSidebar = false;

  //* ------------------------------------------------------------

  constructor(
    private apiUsuario: ApiUsuarioService,
    private apiUsuarios: ApiUsuariosService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  //T* Funciones
  //! Boton flotante
  clickAceptar() {
    this.compDetalleNuevo.recolectarDatos();

    this.authService.register(this.detalleUsuario).subscribe(
      (data: any) => {
        console.log('Respuesta del servidor:', data);
        this.tituloModal = 'Usuario creado';
        this.mensajeModal = 'El usuario ha sido creado correctamente.';
        this.redireccionar = true;
        this.openModal();
      },
      (error) => {
        console.error('Error en la solicitud:', error);
        this.tituloModal = 'Error al crear el usuario';
        this.mensajeModal =
          'No se pudo crear el usuario. Error: ' + error['error']['msg'];
        this.openModal();
      },
    );
  }
  clickCancelar() {
    this.router.navigate(['/usu']);
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

  //! Botones de vista
  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
    if (this.showNavbar) {
      this.showSidebar = false;
    }
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    if (this.showSidebar) {
      this.showNavbar = false;
    }
  }
}
