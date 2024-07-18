import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiValidarStock, ApiRondaValidacionStock } from 'src/app/services/validacion-stock/api-validacion-stock.service';

@Component({
  selector: 'pag-tienda-fisica-revisar-stock',
  templateUrl: './revisar-stock.component.html',
  styleUrls: ['./revisar-stock.component.css']
})
export class PagTiendaFisicaRevisarStockComponent implements OnInit {
  
  notificaciones: string[] = [];
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
  ) {}
  
  ngOnInit() {
    this.recargarLista();
  }
  
  //T* Funciones
  iniciarNuevaRonda() {
    this.ApiRondaValidacionStock.iniciarRondaValidacion().subscribe(
      (respuesta) => {
        console.log('Nueva ronda iniciada:', respuesta);
        this.recargarLista();
      },
      (error) => console.error('Error al iniciar nueva ronda:', error)
    );
  }
  
  recargarLista() {
    this.ApiRondaValidacionStock.obtenerProductosParaValidar().subscribe({
      next: (data) => {
        this.fecha_ronda = data["fecha_ronda"];
        
        //! Modificar datos para mostrar en la tabla
        this.datos = Object.values(data["productos"]).flat().map((producto: any) => {
          const productoModificado = { ...producto };
          
          if (productoModificado.fisica) {
            productoModificado.cantidad_fisica = productoModificado.fisica.cantidad;
          }
          if (productoModificado.validacion) {
            productoModificado.ultima_fecha = productoModificado.validacion.ultima_fecha;
            
            if (productoModificado.ultima_fecha !== this.fecha_ronda) {
              productoModificado.estado = 'Pendiente';
              productoModificado.cantidad_validada = 0;
              
            } else {
              productoModificado.cantidad_validada = productoModificado.validacion.cantidad_validada;
              productoModificado.estado = productoModificado.validacion.estado;
            }
            delete productoModificado.validacion;
            delete productoModificado.fisica;
            delete productoModificado.online;
            
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
    
    this.ApiValidarStock.validarUnidad(this.id_a_validar).subscribe(
      (respuesta) => {
        console.log('Unidad validada:', respuesta);
        this.agregarNotificacion(`Producto '${this.id_a_validar}' validado. Unidades restantes: ${respuesta.unidades_restantes}`);
        this.recargarLista();  //TODO: No se si es lo mas optimo hacer esto cada vez que se valida una unidad
        this.id_a_validar = '';
      },
      
      (error) => {
        this.agregarNotificacion(`Error en '${this.id_a_validar}': ${error.error.mensaje}`);
        console.error('Error al validar unidad:', this.id_a_validar )
        this.id_a_validar = '';
      }
    );
  }
  
  private agregarNotificacion(mensaje: string) {
    this.notificaciones.unshift(mensaje);
    if (this.notificaciones.length > 5) {
      this.notificaciones.pop();
    }
  }

}