import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiMovimientoService, ApiMovimientosService } from 'src/app/services/movimientos/api-movimiento.service';


@Component({
  selector: 'pag-movimientos-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})

export class PagMovimientosVistaGeneralComponent implements OnInit {
  
  //! Tabla de datos
  columnas = [
    { nombre: 'Movimiento', identificador: "movimiento", tipo: 'text' },
    { nombre: "Producto ID", identificador: "idProducto", tipo: "text" },
    { nombre: 'Fecha', identificador: "fecha", tipo: 'date' },
    { nombre: "Cantidad", identificador: "cantidad", tipo: "number" },
    { nombre: "Vendedor", identificador: "vendedor", tipo: "text" },
    { nombre: "Comentario", identificador: "comentario", tipo: "text" },
  ];
  acciones = {
    editar: false,
    eliminar: false,
    detalle: false
  }
  datos: any[] = [];
  
  //* ------------------------------------------------
  
  constructor(
    private router: Router,
    private apiMovimientos: ApiMovimientosService,
    private apiMovimiento: ApiMovimientoService,
  ) { }
  
  ngOnInit(): void {
    //! Cargar todos los movimientos
    this.apiMovimientos.buscar_x_atributo({}).subscribe(
      (data: any) => {
        this.datos = data["msg"];
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  
  //T* Funciones
  //! Botones flotantes
  ClickAgregar(){
    this.router.navigate(['mov/crear']);
  }
}