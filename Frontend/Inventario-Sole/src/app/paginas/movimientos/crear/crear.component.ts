import { Component, OnInit, ViewChild } from '@angular/core';
import { Campo } from '../../../interfaces/campo.interface'
import { CompDetalleNuevoGenericoComponent } from 'src/app/componentes/comp-detalle-nuevo-generico/comp-detalle-nuevo-generico.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiMovimientosService } from 'src/app/services/movimientos/api-movimiento.service';


@Component({
  selector: 'pag-movimientos-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})

export class PagMovimientosCrearComponent implements OnInit {

  //! Ver los componentes hijos
  @ViewChild(CompDetalleNuevoGenericoComponent) compDetalleNuevo!: CompDetalleNuevoGenericoComponent;
  
  //! Datos
  campos: Campo[] = [
    { nombre: "Vendedor", identificador: "vendedor", tipo: "readonly" },
    { nombre: "Movimiento", identificador: "movimiento", tipo: "selector", opciones: ["Entrada", "Salida"] },
    { nombre: "ID producto", identificador: "idProducto", tipo: "input-text" },
    { nombre: "Cantidad", identificador: "cantidad", tipo: "input-number" },
    { nombre: "Comentario", identificador: "comentario", tipo: "textarea-text"}
  ];
  detalleMovimiento = {} ;

  //! Modal
  estaAbierto = false;
  tituloModal = "titulo";
  mensajeModal = "mensaje";
  redireccionar: boolean = false;
  
  //* ------------------------------------------------------------
  
  constructor(
    private apiMovimiento: ApiMovimientosService,
    private authService: AuthService,
    private router: Router,
  ) { }
  
  ngOnInit(): void {
    this.campos[0].valor = this.authService.getAlias();
  }
  
  //T* Funciones
  //! Botones flotantes
  clickAceptar() {
    //! Obtener los datos de los componentes hijos
    this.compDetalleNuevo.recolectarDatos();
    
    //! Revisar si hay campos vacíos
    let optionalFields = ['comentario'];
    
    if (this.hasEmptyFields(this.detalleMovimiento, optionalFields)) {
      this.tituloModal = "Error al crear el movimiento"
      this.mensajeModal = "No se pudo crear el movimiento. Revise los campos e intente de nuevo."
      this.openModal()
      console.error("Hay campos vacíos.");
      return;
    }
    
    //! Crear el movimiento
    this.apiMovimiento.crear(this.detalleMovimiento, this.authService.getToken()).subscribe(
      (res) => {
        console.log("Movimiento creado:", res);
        this.tituloModal = "Movimiento creado"
        this.mensajeModal = "El movimiento ha sido creado correctamente."
        this.redireccionar = true;
        this.openModal()
      },
      (err) => {
        console.error("Error al crear el movimiento:", err);
        this.tituloModal = "Error al crear el movimiento"
        this.mensajeModal = "No se pudo crear el movimiento. Revise los campos e intente de nuevo."
        this.openModal()
      }
    );
  }
  clickCancelar() {
    this.router.navigate(['/mov']);
  }
  
  //! Recolectar datos de los componentes hijos
  onDatosRecolectadosMovimiento(datos: {}) {
    this.detalleMovimiento = datos;
  }
  
  //! Revisar si hay campos vacíos
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0 || value === 'Seleccionar...');
  }
  hasEmptyFields(obj: any, optionalFields: string[] = []): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        //! Campo "Comentario" es opcional
        if (key === 'comentario' && optionalFields.includes(key)) {
          continue;
        }
        
        //! Campo "movimiento" no debe tener el valor "Seleccionar..."
        if (key === 'movimiento' && value === 'Seleccionar...') {
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
      this.router.navigate(['/mov']);
    }
  }
}