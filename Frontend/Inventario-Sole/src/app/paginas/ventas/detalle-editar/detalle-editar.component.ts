import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompDetalleNuevoGenericoComponent } from 'src/app/componentes/comp-detalle-nuevo-generico/comp-detalle-nuevo-generico.component';
import { CompVentaListaProdComponent } from 'src/app/componentes/comp-venta-lista-prod/comp-venta-lista-prod.component';
import { Campo } from 'src/app/interfaces/campo.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiVentaService } from 'src/app/services/ventas/api-venta.service';


@Component({
  selector: 'pag-ventas-detalle',
  templateUrl: './detalle-editar.component.html',
  styleUrls: ['./detalle-editar.component.css']
})

export class PagVentasDetalleEditarComponent implements OnInit {

  //! Ver los componentes hijos
  @ViewChild(CompVentaListaProdComponent) compVentaLista!: CompVentaListaProdComponent;
  @ViewChild(CompDetalleNuevoGenericoComponent) compDetalleNuevo!: CompDetalleNuevoGenericoComponent;
  
  //! Campos para el detalle de la venta
  titulo1 = "Detalle de la venta";
  campos1: Campo[] = [
    { nombre: "ID venta", identificador: "id", tipo: "readonly", valor: this.router.url.split("?")[0].split('/').pop()},
    { nombre: "Fecha", identificador: "fecha", tipo: "readonly"},
    { nombre: "Cliente", identificador: "cliente", tipo: "input-text"},
    { nombre: "Tienda", identificador: "tienda", tipo: "selector", opciones: ["Fisica", "Online"] },
    { nombre: "Total", identificador: "total", tipo: "input-number"},
    { nombre: "Método", identificador: "metodo", tipo: "textarea-text"},
    { nombre: "Comentario", identificador: "comentario", tipo: "textarea-text"}
  ];
  detalleventa: any[] = [];
  
  //! Campos para los productos de la venta
  titulo2 = "Productos";
  campos2: Campo[] = [
    { nombre: "ID producto", identificador: "idProducto", tipo: "input-text" },
    { nombre: "Cantidad", identificador: "cantidad", tipo: "input-number" },
    { nombre: "Precio", identificador: "precio", tipo: "input-number" },
    { nombre: "Comentario", identificador: "comentario", tipo: "textarea-text"}
  ];
  productos: any[] = [];
  datosOriginalesProductos: any[] = [];
  
  //! Para mostrar la opción de editar o no
  mostrarEditar: boolean = false;
  tituloGeneral: string = "";
  
  //! Modal
  estaAbierto = false;
  tituloModal = "titulo";
  mensajeModal = "mensaje";
  redireccionar: boolean = false;
  
  //! Botones flotantes
  mostrarBorrar = false;
  mostrarAceptar = false;
  mostrarCancelar = false;

  //* ------------------------------------------------------------
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private apiVenta: ApiVentaService,
  ) { }
  
  ngOnInit(): void {
    //! Obtener parametro de "editar" la URL
    this.route.queryParams.subscribe(params => {
      this.mostrarEditar = params['editar'] === 'true'; //! Se compara con true porque originalmente es un string
    });
    
    if (this.mostrarEditar === undefined) {
      this.mostrarEditar = true;
    }
    
    if (this.mostrarEditar) {
      this.tituloGeneral = "Editar detalle de la venta";
      this.mostrarAceptar = true;
      this.mostrarCancelar = true;
      this.mostrarBorrar = true;
    } else {
      this.tituloGeneral = "Ver detalle de la venta";
    }
    
    //! Buscar la venta
    this.apiVenta.buscar_x_id(this.router.url.split("?")[0].split('/').pop()).subscribe(
      (res: any) => {
        let datos = res["msg"][0]
        
        //! Detalle de la venta
        this.campos1[0].valor = datos["id"];
        this.campos1[1].valor = datos["fecha"];
        this.campos1[2].valor = datos["cliente"];
        this.campos1[3].valor = datos["tienda"];
        this.campos1[4].valor = datos["total"];
        this.campos1[5].valor = datos["metodo"];
        this.campos1[6].valor = datos["comentario"];
        
        //! Productos de la venta
        this.datosOriginalesProductos = datos["productos"];
      },
      
      (err: any) => {
        console.error('Error al buscar la venta:', err);
      }
    );
  } 
  
  //T* Funciones
  //! Boton flotante
  clickAceptar() {
    this.compDetalleNuevo.recolectarDatos();
    this.compVentaLista.recolectarDatos();
    
    //! Revisar si hay campos vacíos
    let optionalFields = ['comentario'];
    let venta_nueva = { 
      "total": 100, //TODO: calcular el total
      ...this.detalleventa,
      "productos": this.productos 
    };
    
    if (this.hasEmptyFields(venta_nueva, optionalFields) || this.productos.length === 0) {
      this.tituloModal = "Error al actualizar la venta"
      this.mensajeModal = "No se pudo actualizar la venta. Revise los campos e intente de nuevo."
      this.openModal()
      console.error("Hay campos vacíos.");
      return;
    }
    
    let id = this.router.url.split("?")[0].split('/').pop()
    if (id === undefined) {
      return;
    }
    
    //! Actualizar la venta
    this.apiVenta.actualizar(id, venta_nueva, this.authService.getToken()).subscribe(
      (data: any) => {
        console.log("Respuesta del servidor:", data);
        this.tituloModal = "Venta actualizada"
        this.mensajeModal = "La venta ha sido actualizada correctamente."
        this.redireccionar = true;
        this.openModal()
      },
      (error) => {
        console.error("Error en la solicitud:", error);
        this.tituloModal = "Error al actualizar la venta"
        this.mensajeModal = "No se pudo actualizar la venta. Revise los campos e intenta de nuevo."
        this.openModal()
      }
    );
  }
  clickCancelar() {
    this.router.navigate(['/ven']);
  }
  clickBorrar() {
    let id = this.router.url.split("?")[0].split('/').pop()
    if (id === undefined) {
      return;
    }
    
    this.apiVenta.eliminar(id, this.authService.getToken()).subscribe(
      (data: any) => {
        console.log("Respuesta del servidor:", data);
        this.tituloModal = "Venta eliminada"
        this.mensajeModal = "La venta ha sido eliminada correctamente."
        this.redireccionar = true;
        this.openModal()
      },
      (error) => {
        console.error("Error en la solicitud:", error);
        this.tituloModal = "Error al eliminar la venta"
        this.mensajeModal = "No se pudo eliminar la venta. Revise los campos e intenta de nuevo."
        this.openModal()
      }
    );
  }
  
  //! Recolectar datos de los componentes hijos
  onDatosRecolectadosVenta(datos: any[]) {
    this.detalleventa = datos;
  }
  onDatosRecolectadosProductos(datos: any[]) {
    this.productos = datos;
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
        if (key === 'comentario' && optionalFields.includes(key)) {
          continue;
        }
        
        //! Campo "tienda" no debe tener el valor "Seleccionar..."
        if (key === 'tienda' && value === 'Seleccionar...') {
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
      this.router.navigate(['/ven']);
    }
  }
}
