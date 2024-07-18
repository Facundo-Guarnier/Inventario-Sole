import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiValidarStock, ApiRondaValidacionStock } from 'src/app/services/validacion-stock/api-validacion-stock.service';

@Component({
  selector: 'pag-tienda-fisica-revisar-stock',
  templateUrl: './revisar-stock.component.html',
  styleUrls: ['./revisar-stock.component.css']
})
export class PagTiendaFisicaRevisarStockComponent implements OnInit {
  
  productosParaValidar: any[] = [];
  notificaciones: string[] = [];

  constructor(
    private ApiRondaValidacionStock: ApiRondaValidacionStock,
    private ApiValidarStock: ApiValidarStock,
  ) {}

  ngOnInit() {
    this.cargarProductosParaValidar();
  }

  iniciarNuevaRonda() {
    this.ApiRondaValidacionStock.iniciarRondaValidacion().subscribe(
      (respuesta) => {
        console.log('Nueva ronda iniciada:', respuesta);
        this.cargarProductosParaValidar();
      },
      (error) => console.error('Error al iniciar nueva ronda:', error)
    );
  }

  cargarProductosParaValidar() {
    this.ApiRondaValidacionStock.obtenerProductosParaValidar().subscribe(
      (productos) => {
        this.productosParaValidar = productos;
      },
      (error) => console.error('Error al cargar productos:', error)
    );
  }

  validarUnidad(idProducto: string) {
    this.ApiValidarStock.validarUnidad(idProducto).subscribe(
      (respuesta) => {
        console.log('Unidad validada:', respuesta);
        this.actualizarProductoEnLista(idProducto, respuesta);
        this.agregarNotificacion(`Producto ${idProducto} validado. Unidades restantes: ${respuesta.unidades_restantes}`);
      },
      (error) => console.error('Error al validar unidad:', error)
    );
  }

  private actualizarProductoEnLista(idProducto: string, respuesta: any) {
    const index = this.productosParaValidar.findIndex(p => p._id === idProducto);
    if (index !== -1) {
      this.productosParaValidar[index].validacion = {
        ...this.productosParaValidar[index].validacion,
        cantidad_validada: this.productosParaValidar[index].fisica.cantidad - respuesta.unidades_restantes,
        estado: respuesta.estado_validacion
      };
      if (respuesta.unidades_restantes === 0) {
        this.productosParaValidar.splice(index, 1);
      }
    }
  }

  private agregarNotificacion(mensaje: string) {
    this.notificaciones.unshift(mensaje);
    if (this.notificaciones.length > 5) {
      this.notificaciones.pop();
    }
  }
}