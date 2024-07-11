import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiVentasService } from '../../../services/ventas/api-venta.service';


@Component({
  selector: 'pag-ventas-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})

export class PagVentasVistaGeneralComponent implements OnInit {
  
  //! NavBar
  pagActual = 'ven';
  
  //! Tabla de datos
  acciones = {
    editar: true,
    eliminar: true,
    detalle: true
  }
  
  columnas = [
    { nombre: 'ID venta', identificador: "id", tipo: 'text' },
    { nombre: 'Cliente', identificador: "cliente", tipo: 'text' },
    { nombre: 'Fecha', identificador: "fecha", tipo: 'date' },
    { nombre: 'Total', identificador: "total", tipo: 'number' },
    { nombre: 'Tienda', identificador: "tienda", tipo: 'text' },
    { nombre: 'Metodo', identificador: "metodo", tipo: 'number' },
  ];
  
  datos: any[] = [];
  
  constructor(
    private router: Router,
    private apiVentas: ApiVentasService,
  ) { }
  
  ngOnInit(): void {
    let filtro = {}
    this.apiVentas.buscar_x_atributo(filtro).subscribe({
      next: (data) => {
        this.datos = Object.values(data).flat();
      },
      error: (error) => {
        console.error('ERROR al cargar ventas:', error);
      }
    });
  }
  
  //! Botones flotantes
  ClickAgregar(){
    this.router.navigate(['ven/crear']);
  };

}