import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiProductosService, ApiRevisarStockService } from 'src/app/services/productos/api-producto.service';

@Component({
  selector: 'pag-tienda-fisica-revisar-stock',
  templateUrl: './revisar-stock.component.html',
  styleUrls: ['./revisar-stock.component.css']
})
export class PagTiendaFisicaRevisarStockComponent implements OnInit {
  
  columnas = [
    { nombre: 'ID producto', identificador: "id", tipo: 'text' },
    { nombre: 'Marca', identificador: "marca", tipo: 'text' },
    { nombre: 'Descripción', identificador: "descripcion", tipo: 'text' },
    { nombre: 'Talle', identificador: "talle", tipo: 'text' },
    { nombre: 'Cantidad', identificador: "cantidad", tipo: 'number' },
  ];
  
  acciones = {
    editar: false,
    eliminar: false,
    detalle: false
  }
  
  datos: any[] = [];
  
  
  idProducto: string = '';
  mensaje: string = '';
  
  //* ------------------------------------------------------------
  
  constructor(
    private apiRevisarStock: ApiRevisarStockService,
    private authService: AuthService,
    private apiProductos: ApiProductosService,
  ) { }
  
  ngOnInit(): void {

    //! Buscar todos los productos de la tienda
    this.apiProductos.buscar_x_atributo({"tienda": "fisica"}).subscribe({
      next: (data) => {
        this.datos = Object.values(data).flat().map((producto: any) => {
          const productoModificado = { ...producto };
          
          if (productoModificado.fisica) {
            productoModificado.precio = productoModificado.fisica.precio;
            productoModificado.cantidad = productoModificado.fisica.cantidad;
          }
          
          return productoModificado;
        });
      },
      error: (error) => {
        console.error('ERROR al cargar productos:', error);
      }
    });

  }

  revisarStock() {
    
    this.apiRevisarStock.revisarStock(this.idProducto, this.authService.getToken()).subscribe(
      response => {
        console.log('Revisar stock', response);
        
        //! Eliminar de datos
        this.datos = this.datos.filter(producto => producto.id !== this.idProducto);
        console.log('Datos', this.datos);
      },
      error => {
      }
    );
  }

}