import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiVentasService } from '../../../services/ventas/api-venta.service';
import { CompBarraLateralComponent } from 'src/app/componentes/comp-barra-lateral/comp-barra-lateral.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Filtro } from 'src/app/interfaces/filtro.interface';
import { formatDate } from '@angular/common';
import { ApiProductoService } from 'src/app/services/productos/api-producto.service';


@Component({
  selector: 'pag-ventas-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})

export class PagVentasVistaGeneralComponent implements OnInit {
  
  //! Tabla de datos
  acciones = {
    editar: true,
    eliminar: false,
    detalle: true
  }
  
  columnas = [
    { nombre: 'ID venta', identificador: "id", tipo: 'text' },
    // { nombre: 'Cliente', identificador: "cliente", tipo: 'text' },
    // { nombre: 'Fecha', identificador: "fecha", tipo: 'date' },
    { nombre: 'Monto total', identificador: "total", tipo: 'currency' },
    { nombre: 'Tienda', identificador: "tienda", tipo: 'text' },
    { nombre: 'Metodo', identificador: "metodo", tipo: 'text' },
  ];
  
  datos: any[] = [];
  
  columnasSecundarias = [
    { nombre: 'ID producto', identificador: "id_producto", tipo: 'text' },
    { nombre: 'Descripcion', identificador: "descripcion", tipo: 'text' },
    { nombre: 'Cantidad', identificador: "cantidad", tipo: 'number' },
    { nombre: 'Total p. original', identificador: "total_precio_original", tipo: 'currency' },
    { nombre: 'Total p. venta', identificador: "total_precio_venta", tipo: 'currency' },
  ];

  datosSecundarios: any[] = [];
  
  //! Busqueda
  filtrosBusqueda: any[] = []
  filtrosLista: Filtro[] = [
    {nombre: 'Tienda', identificador:"tienda", opciones: ['Fisica', 'Online']},
    {nombre: 'Rango de fecha', identificador:"fecha", opciones: ["Hoy", "Ayer", "Esta semana", "Semana pasada", "Este mes", "Mes pasado"]},
  ]
  filtrosCheckbox: string[] = []
  
  //! Paginamiento s
  paginaActual = 1;
  porPagina = 20;
  totalDatos = 0;
  totalPaginas = 0;
  
  //! Vista
  showNavbar = false;
  showSidebar = false;
  
  //* ------------------------------------------------------------
  
  constructor(
    private router: Router,
    private apiVentas: ApiVentasService,
    private authService: AuthService,
    private productoService : ApiProductoService,
  ) { }
  
  ngOnInit(): void {
    this.recargarLista();
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
      
      if (datos.nombre === "fecha") {
        datos.valor = this.traducirFecha(datos.valor);
      }
      
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
  traducirFecha(fechaStr:string): string {
    const hoy = new Date();
    let fecha = "";
    
    if (fechaStr === "Hoy") {
    //! Hoy
    fecha = `${this.formatearFecha(hoy)} al ${this.formatearFecha(hoy)}`
    
    } else if (fechaStr === "Ayer") {
    //! Ayer
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    fecha = `${this.formatearFecha(ayer)} al ${this.formatearFecha(ayer)}`
    
    } else if (fechaStr === "Esta semana") {
    //! Esta semana (domingo a hoy)
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    fecha = `${this.formatearFecha(inicioSemana)} al ${this.formatearFecha(hoy)}`
    
    } else if (fechaStr === "Semana pasada") {
    //! Semana pasada
    const inicioSemanaPasada = new Date(hoy);
    inicioSemanaPasada.setDate(hoy.getDate() - hoy.getDay() - 7);
    const finSemanaPasada = new Date(hoy);
    finSemanaPasada.setDate(hoy.getDate() - hoy.getDay() - 1);
    fecha = `${this.formatearFecha(inicioSemanaPasada)} al ${this.formatearFecha(finSemanaPasada)}`
    
    } else if (fechaStr === "Este mes") {
    //! Este mes
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    fecha = `${this.formatearFecha(inicioMes)} al ${this.formatearFecha(hoy)}`
    
    } else if (fechaStr === "Mes pasado") {
    //! Mes pasado
    const inicioMesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const finMesPasado = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
    fecha = `${this.formatearFecha(inicioMesPasado)} al ${this.formatearFecha(finMesPasado)}`
    
  } else {
      console.error('ERROR: Fecha no reconocida');
    }
    return fecha;
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
    
    //! Buscar todas las ventas
    this.apiVentas.buscar_x_atributo(filtrosObj, this.paginaActual, this.porPagina).subscribe({
      next: (data) => {
        this.datos = Object.values(data["msg"]).flat();
        this.totalDatos = Math.max(1, data["total"]);
        this.totalPaginas = Math.ceil(this.totalDatos/this.porPagina);
        
        //! Buscar los productos de cada venta
        this.datos.forEach((venta) => {
          venta.productos.forEach((producto:any) => {
            this.productoService.buscar_x_id(producto.idProducto).subscribe({
              next: (data) => {
                this.datosSecundarios.push({
                  "id": venta.id,
                  "id_producto": data["msg"][0].id,
                  "descripcion": data["msg"][0].descripcion,
                  "total_precio_original": data["msg"][0][(venta.tienda).toLowerCase()]["precio"] * producto.cantidad,
                  "total_precio_venta": producto.precio * producto.cantidad,
                  "cantidad": producto.cantidad
                })
              },
              error: (error) => {
                console.error('ERROR al cargar productos:', error);
              }
            });
          });
        });
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
}