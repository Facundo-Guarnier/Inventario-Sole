import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiValidarStock, ApiRondaValidacionStock } from 'src/app/services/validacion-stock/api-validacion-stock.service';
import { Notificacion } from 'src/app/interfaces/notificacion.interface';

@Component({
  selector: 'pag-tienda-online-revisar-stock',
  templateUrl: './revisar-stock.component.html',
  styleUrls: ['./revisar-stock.component.css']
})
export class PagTiendaOnlineRevisarStockComponent implements OnInit {
  
  notificaciones: Notificacion[] = [];
  fecha_ronda: string = '';
  id_a_validar: string = '';
  
  columnas = [
    { nombre: 'ID producto', identificador: "id", tipo: 'text' },
    { nombre: 'Cantidad fisica', identificador: "cantidad_fisica", tipo: 'number' },
    { nombre: 'Cantidad validada', identificador: "cantidad_validada", tipo: 'number' },
    { nombre: 'Estado', identificador: "estado", tipo: 'text' },
    { nombre: 'Marca', identificador: "marca", tipo: 'text' },
    { nombre: 'Descripción', identificador: "descripcion", tipo: 'text' },
    { nombre: 'Talle', identificador: "talle", tipo: 'text' },
  ];
  
  acciones = {
    editar: false,
    eliminar: false,
    detalle: false
  }
  
  datos: any[] = [];
  
  //* ------------------------------------------------------------
  
  constructor(
    private ApiRondaValidacionStock: ApiRondaValidacionStock,
    private ApiValidarStock: ApiValidarStock,
    private AuthService: AuthService,
  ) {}
  
  ngOnInit() {
    this.recargarLista();
  }
  
  //T* Funciones
  iniciarNuevaRonda() {
    this.ApiRondaValidacionStock.iniciarRondaValidacion(this.AuthService.getToken(), "online").subscribe(
      (respuesta) => {
        console.log('Nueva ronda iniciada:', respuesta);
        this.recargarLista();
        this.notificaciones = [];
      },
      (error) => console.error('Error al iniciar nueva ronda:', error)
    );
  }
  
  recargarLista() {
    this.ApiRondaValidacionStock.obtenerProductosParaValidar("online").subscribe({
      next: (data) => {
        this.fecha_ronda = data["fecha_ronda"];
        console.log('Data:', data);
        
        //! Modificar datos para mostrar en la tabla
        this.datos = Object.values(data["productos"]).flat().map((producto: any) => {
          const productoModificado = { ...producto };
          
          if (productoModificado.online) {
            productoModificado.cantidad_fisica = productoModificado.online.cantidad;
          }
          
          if (productoModificado.online.validacion) {
            productoModificado.ultima_fecha = productoModificado.online.validacion.ultima_fecha;
            
            if (productoModificado.ultima_fecha !== this.fecha_ronda) {
              productoModificado.estado = 'Pendiente';
              productoModificado.cantidad_validada = 0;
              
            } else {
              productoModificado.cantidad_validada = productoModificado.online.validacion.cantidad_validada;
              productoModificado.estado = productoModificado.online.validacion.estado;
            }
            delete productoModificado.fisica;
            delete productoModificado.online;
            
          } else {
            productoModificado.estado = 'Pendiente';
            productoModificado.cantidad_validada = 0;
          }
          return productoModificado;
        });
      },
      
      error: (error) => { 
        console.error('Error al cargar productos:', error)
      }
    });
  }
  
  validarUnidad() {
    //! Validar si la idproducto está en la lista de datos.
    //* No debería hacer este filtro porque debería poder haber alguna discrepancia en el stock
    // if (!this.datos.find(p => p.id === idProducto)) {
    //   console.error('Producto no encontrado en la lista de productos para validar');
    //   return;
    // }
    
    this.ApiValidarStock.validarUnidad(this.id_a_validar, "online", this.AuthService.getToken()).subscribe(
      (respuesta) => {
        console.log('Unidad validada:', respuesta);
        this.agregarNotificacion({
          mensaje: `Producto '${this.id_a_validar}' validado. Unidades restantes: ${respuesta.unidades_restantes}`,
          puedeDeshacer: true,
          idProducto: this.id_a_validar
        });
        this.recargarLista();
        this.id_a_validar = '';
      },
      (error) => {
        this.agregarNotificacion({
          mensaje: `Error en '${this.id_a_validar}': ${error.error.mensaje}`,
          puedeDeshacer: false
        });
        console.error('Error al validar unidad:', this.id_a_validar );
        this.id_a_validar = '';
      }
    );
  }
  
  private agregarNotificacion(notificacion: Notificacion) {
    this.notificaciones.unshift(notificacion);
    if (this.notificaciones.length > 5) {
      this.notificaciones.pop();
    }
  }
  
  deshacerAccion(index: number) {
    const notificacion = this.notificaciones[index];
    if (notificacion.puedeDeshacer && notificacion.idProducto) {
      console.log('Deshaciendo validación:', notificacion.idProducto);
      this.ApiValidarStock.deshacerValidacion(notificacion.idProducto, "online", this.AuthService.getToken()).subscribe(
        (respuesta) => {
          console.log('Validación deshecha:', respuesta);
          this.notificaciones[index] = {
            mensaje: `Deshecho: ${notificacion.mensaje}`,
            puedeDeshacer: false
          };
          this.recargarLista();
        },
        (error) => {
          console.error('Error al deshacer validación:', error);
          this.notificaciones[index] = {
            mensaje: `Error al deshacer validación: ${error.error.mensaje}`,
            puedeDeshacer: false
          };
        }
      );
    }
  }

}