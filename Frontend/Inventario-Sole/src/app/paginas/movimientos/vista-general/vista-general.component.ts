import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filtro } from 'src/app/interfaces/filtro.interface';
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
  
    //! Busqueda
    filtrosBusqueda: any[] = []
    filtrosLista: Filtro[] = [
      {nombre: 'Movimiento', identificador:"movimiento", opciones: ['Entrada', 'Salida']},
      {nombre: 'Tienda', identificador:"tienda", opciones: ['Fisica', 'Online']},
      {nombre: 'Rango de fecha', identificador:"fecha", opciones: this.generarOpcionesFecha()},
    ]
    filtrosCheckbox: string[] = []
  
  //! Paginamiento 
  paginaActual = 1;
  porPagina = 20;
  totalDatos = 0;
  totalPaginas = 0;
  
  //* ------------------------------------------------
  
  constructor(
    private router: Router,
    private apiMovimientos: ApiMovimientosService,
    private apiMovimiento: ApiMovimientoService,
  ) { }
  
  ngOnInit(): void {
    //! Cargar todos los movimientos
    // this.apiMovimientos.buscar_x_atributo({}, this.paginaActual, this.porPagina).subscribe(
    //   (data: any) => {
    //     this.datos = data["msg"];
    //   },
    //   (error: any) => {
    //     console.error(error);
    //   }
    // );
    this.recargarLista();
  }
  
  //T* Funciones
  //! Botones flotantes
  ClickAgregar(){
    this.router.navigate(['mov/crear']);
  }
  
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
  
    this.apiMovimientos.buscar_x_atributo(filtrosObj, this.paginaActual, this.porPagina).subscribe({
      next: (data) => {
        this.datos = Object.values(data["msg"]).flat();
        this.totalDatos = Math.max(1, data["total"]);
        this.totalPaginas = Math.ceil(this.totalDatos/this.porPagina);
      },
      error: (error) => {
        console.error('ERROR al cargar ventas:', error);
      }
    });
  }
  
  //! Paginamiento
  clickPagina(numero: number){
    this.paginaActual = numero;
    this.recargarLista();
  }
}