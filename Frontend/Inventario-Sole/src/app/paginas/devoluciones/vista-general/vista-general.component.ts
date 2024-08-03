import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filtro } from 'src/app/interfaces/filtro.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiDevolucionesService } from 'src/app/services/devoluciones/api-devoluciones.service';
import { ApiProductoService } from 'src/app/services/productos/api-producto.service';

@Component({
  selector: 'ág-devoluciones-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})
export class PagDevolucionesVistaGeneralComponent implements OnInit {

  //! Tabla de datos
  acciones = {
    editar: false,
    eliminar: false,
    detalle: false,
  }
  
  columnas = [
    { nombre: 'ID producto', identificador: "id_producto", tipo: 'text' },
    { nombre: 'Descripcion prod.', identificador: "descripcion_producto", tipo: 'text' },
    { nombre: "Fecha", identificador: "fecha_devolucion", tipo: 'date' },
    { nombre: 'Cantidad', identificador: "cantidad", tipo: 'number' },
    { nombre: 'Tienda', identificador: "tienda", tipo: 'text' },
    { nombre: 'Comentario dev.', identificador: "comentario", tipo: 'text' },
  ];
  
  datos: any[] = [
    // {"id": "AAAA1", "descripcion": "Producto 1", "cantidad": 1, "tienda": "Fisica"},
  ];
  
  //! Busqueda
  filtrosBusqueda: any[] = []
  filtrosLista: Filtro[] = [
    {nombre: 'Tienda', identificador:"tienda", opciones: ['Fisica', 'Online']},
    {nombre: 'Rango de fecha', identificador:"fecha", opciones: this.generarOpcionesFecha()},
  ]
  filtrosCheckbox: string[] = []
  
  //! Paginamiento
  paginaActual = 1;
  porPagina = 20;
  totalDatos = 0;
  totalPaginas = 0;
  
  //! Vista
  showNavbar = false;
  showSidebar = false;
  
  //! Mostrar la pagina actual
  pagActual: string = '';
  
  //* ------------------------------------------------------------
  
  constructor(
    private router: Router,
    private authService: AuthService,
    // private apiProductoService: ApiProductoService,
    private apiDevolucionesService: ApiDevolucionesService,
  ) { }
  
  ngOnInit(): void {
    this.recargarLista();
    this.pagActual = this.router.url.split('/')[1].split('?')[0];
  }
  
  //T* Funciones
  //! Botones flotantes
  ClickAgregar(){
    this.router.navigate(['dev/crear']);
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
      //! Crear un nuevo objeto con el formato deseado
      const nuevoFiltro = { [datos.nombre]: datos.valor };
      
      //! Buscar si ya existe un filtro con el mismo nombre
      const indiceExistente = this.filtrosBusqueda.findIndex(filtro => Object.keys(filtro)[0] === datos.nombre);
      
      if (indiceExistente !== -1) {
        //! Si existe, reemplazarlo
        this.filtrosBusqueda[indiceExistente] = nuevoFiltro;
      } else {
        //! Si no existe, añadirlo
        this.filtrosBusqueda.push(nuevoFiltro);
      }
    } else {
      //! Eliminar el filtro si existe
      this.filtrosBusqueda = this.filtrosBusqueda.filter(filtro => Object.keys(filtro)[0] !== datos.nombre);
    }
    
    this.recargarLista();
  }
  
  //! Generar opciones de fecha
  generarOpcionesFecha(): string[] {
    const hoy = new Date();
    const opciones: string[] = [];
    
    //TODO: Mejorar esto
    //! Hoy
    opciones.push(`${this.formatearFecha(hoy)} al ${this.formatearFecha(hoy)}`);
    
    //! Ayer
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    opciones.push(`${this.formatearFecha(ayer)} al ${this.formatearFecha(ayer)}`);
    
    //! Esta semana (domingo a hoy)
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    opciones.push(`${this.formatearFecha(inicioSemana)} al ${this.formatearFecha(hoy)}`);
    
    //! Este mes
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    opciones.push(`${this.formatearFecha(inicioMes)} al ${this.formatearFecha(hoy)}`);
    
    //! Este año
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
    
    //! Buscar todas las devoluciones
    this.apiDevolucionesService.buscar_x_atributo(filtrosObj, this.paginaActual, this.porPagina).subscribe(
      (data) => {
        this.datos = Object.values(data["msg"]).flat();;
        this.totalDatos = data.total;
        this.totalPaginas = Math.ceil(this.totalDatos / this.porPagina);
        console.log("Devoluciones:", this.datos);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  //! Paginamiento
  clickPagina(numero: number){
    this.paginaActual = numero;
    this.recargarLista();
  }
  
  //! Botones de vista
  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
    if (this.showNavbar) {
      this.showSidebar = false;
    }
  }
  
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    if (this.showSidebar) {
      this.showNavbar = false;
    }
  }
  
  //! Mostrar la pagina actual
  getPaginaActual(): string {
    switch(this.pagActual) {
      case 'ven': return 'Ventas';
      case 'dev': return 'Devoluciones';
      case 'mov': return 'Movimientos';
      case 'tf': return 'Tienda Física';
      case 'to': return 'Tienda Online';
      case 'usu': return 'Usuarios';
      default: return 'Página Actual';
    }
  }
}