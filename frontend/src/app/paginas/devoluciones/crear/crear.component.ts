import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CompDetalleNuevoGenericoComponent } from 'src/app/componentes/comp-detalle-nuevo-generico/comp-detalle-nuevo-generico.component';
import { Campo } from 'src/app/interfaces/campo.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiDevolucionesService } from 'src/app/services/devoluciones/api-devoluciones.service';

@Component({
  selector: 'pag-devoluciones-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css'],
})
export class PagDevolucionesCrearComponent implements OnInit {
  //! Ver los componentes hijos
  @ViewChild(CompDetalleNuevoGenericoComponent)
  compDetalleNuevo!: CompDetalleNuevoGenericoComponent;

  //! Datos
  campos: Campo[] = [
    { nombre: 'ID producto', identificador: 'id', tipo: 'input-text' },
    {
      nombre: 'Tienda',
      identificador: 'tienda',
      tipo: 'selector',
      opciones: ['Fisica', 'Online'],
    },
    { nombre: 'Cantidad', identificador: 'cantidad', tipo: 'input-number' },
    {
      nombre: 'Comentario',
      identificador: 'comentario',
      tipo: 'textarea-text',
    },
  ];
  detalleDevolucion = {};

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
    private authService: AuthService,
    private router: Router,
    private apiDevoluciones: ApiDevolucionesService,
  ) {}

  ngOnInit(): void {}

  //T* Funciones
  //! Botones flotantes
  clickAceptar() {
    //! Obtener los datos de los componentes hijos
    this.compDetalleNuevo.recolectarDatos();

    //! Revisar si hay campos vacíos
    let optionalFields = ['comentario'];

    if (this.hasEmptyFields(this.detalleDevolucion, optionalFields)) {
      this.tituloModal = 'Error al crear la devolucion';
      this.mensajeModal =
        'No se pudo crear la devolucion. Hay campos vacíos. Revise los campos e intente de nuevo.';
      this.openModal();
      return;
    }

    //! Crear la devolucion
    this.apiDevoluciones
      .crear(this.detalleDevolucion, this.authService.getToken())
      .subscribe(
        (res) => {
          console.log('Devolucion creado:', res);
          this.tituloModal = 'Devolucion creado';
          this.mensajeModal = 'La devolucion ha sido creado correctamente.';
          this.redireccionar = true;
          this.openModal();
        },
        (err) => {
          console.error('Error al crear la devolucion:', err);
          this.tituloModal = 'Error al crear la devolucion';
          this.mensajeModal =
            'No se pudo crear la devolucion. Error: ' + err['error']['msg'];
          this.openModal();
        },
      );
  }
  clickCancelar() {
    this.router.navigate(['/dev']);
  }

  //! Recolectar datos de los componentes hijos
  onDatosRecolectadosDevolucion(datos: {}) {
    this.detalleDevolucion = datos;
  }

  //! Revisar si hay campos vacíos
  isEmpty(value: any): boolean {
    return (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      value === 'Seleccionar...'
    );
  }
  hasEmptyFields(obj: any, optionalFields: string[] = []): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        //! Campo "Comentario" es opcional
        if (key === 'comentario' && optionalFields.includes(key)) {
          continue;
        }

        if (value === 'Seleccionar...') {
          return true;
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
          if (this.hasEmptyFields(value, optionalFields)) {
            return true;
          }
        } else if (Array.isArray(value)) {
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
      this.router.navigate(['/dev']);
    }
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
