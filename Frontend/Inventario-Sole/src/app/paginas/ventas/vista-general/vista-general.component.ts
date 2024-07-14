import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiVentasService } from '../../../services/ventas/api-venta.service';
import { CompBarraLateralComponent } from 'src/app/componentes/comp-barra-lateral/comp-barra-lateral.component';
import { AuthService } from 'src/app/services/auth/auth.service';


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
    eliminar: false,
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
  
  //! Busqueda
  filtrosBusqueda: any[] = []
  // @ViewChild(CompBarraLateralComponent) compBarraLateralComponent!: CompBarraLateralComponent;
  
  //* ------------------------------------------------------------
  
  constructor(
    private router: Router,
    private apiVentas: ApiVentasService,
    private authService: AuthService,
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
  
  //T* Funciones
  //! Botones flotantes
  ClickAgregar(){
    this.router.navigate(['ven/crear']);
  };

  //! Busqueda
  clickBuscar(datos: any[]){
    console.log("BArra de busqueda:", datos);
    this.apiVentas.buscar_x_atributo({"palabra_clave": datos}).subscribe({
      next: (data) => {
        this.datos = Object.values(data).flat();
        console.log("Datos de la busqueda:", data["msg"]);
      },
      error: (error) => {
        console.error('ERROR al cargar usuarios:', error);
      }
    });
  }

  leerFiltros(datos: {nombre: string, valor: string}){
    if (datos["valor"] !== "Seleccionar...") {
      this.filtrosBusqueda.push(datos);
      console.log("Filtros de busqueda:", this.filtrosBusqueda); 
    } else {
      this.filtrosBusqueda = this.filtrosBusqueda.filter(filtro => filtro.nombre !== datos["nombre"]);
      console.log("Filtros de busqueda:", this.filtrosBusqueda);
    }
  }
}