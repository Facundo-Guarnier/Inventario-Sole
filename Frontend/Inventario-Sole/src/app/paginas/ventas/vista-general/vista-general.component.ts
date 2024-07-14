import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiVentasService } from '../../../services/ventas/api-venta.service';
import { CompBarraLateralComponent } from 'src/app/componentes/comp-barra-lateral/comp-barra-lateral.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Filtro } from 'src/app/interfaces/filtro.interface';
import { formatDate } from '@angular/common';


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
  filtrosLista: Filtro[] = [
    {nombre: 'Tienda', identificador:"tienda", opciones: ['Fisica', 'Online']},
    {nombre: 'Rango de fecha', identificador:"fecha", opciones: this.generarOpcionesFecha()},
  ]
  filtrosCheckbox: string[] = []
  
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
  clickBuscar(datos: string){
    if (datos === "") {
      this.filtrosBusqueda = this.filtrosBusqueda.filter(filtro => Object.keys(filtro)[0] !== "palabra_clave");
    } else {
      this.filtrosBusqueda.push({"palabra_clave": datos});
    }
    this.recargarLista();
  }
  
  leerFiltros(datos: {nombre: string, valor: string}){
    if (datos.valor !== "Seleccionar...") {
      // Crear un nuevo objeto con el formato deseado
      const nuevoFiltro = { [datos.nombre]: datos.valor };
      
      // Buscar si ya existe un filtro con el mismo nombre
      const indiceExistente = this.filtrosBusqueda.findIndex(filtro => Object.keys(filtro)[0] === datos.nombre);
      
      if (indiceExistente !== -1) {
        // Si existe, reemplazarlo
        this.filtrosBusqueda[indiceExistente] = nuevoFiltro;
      } else {
        // Si no existe, añadirlo
        this.filtrosBusqueda.push(nuevoFiltro);
      }
    } else {
      // Eliminar el filtro si existe
      this.filtrosBusqueda = this.filtrosBusqueda.filter(filtro => Object.keys(filtro)[0] !== datos.nombre);
    }
    
    this.recargarLista();
  }
  
  generarOpcionesFecha(): string[] {
    const hoy = new Date();
    const opciones: string[] = [];
  
    // Hoy
    opciones.push(`${this.formatearFecha(hoy)} al ${this.formatearFecha(hoy)}`);
  
    // Ayer
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    opciones.push(`${this.formatearFecha(ayer)} al ${this.formatearFecha(ayer)}`);
  
    // Esta semana (domingo a hoy)
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    opciones.push(`${this.formatearFecha(inicioSemana)} al ${this.formatearFecha(hoy)}`);
  
    // Este mes
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    opciones.push(`${this.formatearFecha(inicioMes)} al ${this.formatearFecha(hoy)}`);
  
    // Este año
    const inicioAno = new Date(hoy.getFullYear(), 0, 1);
    opciones.push(`${this.formatearFecha(inicioAno)} al ${this.formatearFecha(hoy)}`);
  
    return opciones;
  }
  
  formatearFecha(fecha: Date): string {
    return formatDate(fecha, 'dd-MM-yyyy', 'en-US');
  }
  
  //! Recargar lista
  recargarLista(){
    const filtrosObj = this.filtrosBusqueda.reduce((acc, filtro) => {
      const key = Object.keys(filtro)[0];
      acc[key] = filtro[key];
      return acc;
    }, {});
  
    console.log("Filtros de busqueda:", filtrosObj);
  
    this.apiVentas.buscar_x_atributo(filtrosObj).subscribe({
      next: (data) => {
        this.datos = Object.values(data).flat();
      },
      error: (error) => {
        console.error('ERROR al cargar ventas:', error);
      }
    });
  }
}