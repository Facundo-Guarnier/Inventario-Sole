import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filtro } from 'src/app/interfaces/filtro.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  ApiMovimientoService,
  ApiMovimientosService,
} from 'src/app/services/movimientos/api-movimiento.service';

@Component({
  selector: 'pag-movimientos-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css'],
})
export class PagMovimientosVistaGeneralComponent implements OnInit {
  //! Tabla de datos
  columnas = [
    { nombre: 'Movimiento', identificador: 'movimiento', tipo: 'text' },
    { nombre: 'Producto ID', identificador: 'idProducto', tipo: 'text' },
    { nombre: 'Fecha', identificador: 'fecha', tipo: 'date' },
    { nombre: 'Cantidad', identificador: 'cantidad', tipo: 'number' },
    { nombre: 'Vendedor', identificador: 'vendedor', tipo: 'text' },
    { nombre: 'Tienda', identificador: 'tienda', tipo: 'text' },
    { nombre: 'Comentario', identificador: 'comentario', tipo: 'text' },
  ];
  acciones = {
    editar: false,
    eliminar: false,
    detalle: false,
  };
  datos: any[] = [];

  //! Busqueda
  filtrosBusqueda: any[] = [];
  filtrosLista: Filtro[] = [
    {
      nombre: 'Movimiento',
      identificador: 'movimiento',
      opciones: ['Entrada', 'Salida'],
    },
    {
      nombre: 'Tienda',
      identificador: 'tienda',
      opciones: ['Fisica', 'Online'],
    },
    {
      nombre: 'Rango de fecha',
      identificador: 'fecha',
      opciones: this.generarOpcionesFecha(),
    },
  ];
  filtrosCheckbox: string[] = [];

  //! Paginamiento
  paginaActual = 1;
  porPagina = 20;
  totalDatos = 0;
  totalPaginas = 0;

  //! Vista
  showNavbar = false;
  showSidebar = false;

  //! Botones flotantes
  mostrarAgregar = this.authService.isAdmin();

  //! Mostrar la pagina actual
  pagActual: string = '';

  //* ------------------------------------------------

  constructor(
    private router: Router,
    private apiMovimientos: ApiMovimientosService,
    private apiMovimiento: ApiMovimientoService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.recargarLista();
    this.pagActual = this.router.url.split('/')[1].split('?')[0];
  }

  //T* Funciones
  //! Botones flotantes
  ClickAgregar() {
    this.router.navigate(['mov/crear']);
  }

  //! Busqueda
  clickBuscar(datos: string) {
    if (datos === '') {
      this.filtrosBusqueda = this.filtrosBusqueda.filter(
        (filtro) => Object.keys(filtro)[0] !== 'palabra_clave',
      );
    } else {
      this.filtrosBusqueda.push({ palabra_clave: datos });
    }
    this.recargarLista();
  }

  leerFiltros(datos: { nombre: string; valor: string }) {
    if (datos.valor !== 'Seleccionar...') {
      const nuevoFiltro = { [datos.nombre]: datos.valor };

      //! Buscar si ya existe un filtro con el mismo nombre
      const indiceExistente = this.filtrosBusqueda.findIndex(
        (filtro) => Object.keys(filtro)[0] === datos.nombre,
      );

      if (indiceExistente !== -1) {
        this.filtrosBusqueda[indiceExistente] = nuevoFiltro;
      } else {
        this.filtrosBusqueda.push(nuevoFiltro);
      }
    } else {
      //! Eliminar el filtro si existe
      this.filtrosBusqueda = this.filtrosBusqueda.filter(
        (filtro) => Object.keys(filtro)[0] !== datos.nombre,
      );
    }

    this.recargarLista();
  }

  generarOpcionesFecha(): string[] {
    const hoy = new Date();
    const opciones: string[] = [];

    //! Hoy
    opciones.push(`${this.formatearFecha(hoy)} al ${this.formatearFecha(hoy)}`);

    //! Ayer
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    opciones.push(
      `${this.formatearFecha(ayer)} al ${this.formatearFecha(ayer)}`,
    );

    //! Esta semana (domingo a hoy)
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    opciones.push(
      `${this.formatearFecha(inicioSemana)} al ${this.formatearFecha(hoy)}`,
    );

    //! Este mes
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    opciones.push(
      `${this.formatearFecha(inicioMes)} al ${this.formatearFecha(hoy)}`,
    );

    //! Este año
    const inicioAno = new Date(hoy.getFullYear(), 0, 1);
    opciones.push(
      `${this.formatearFecha(inicioAno)} al ${this.formatearFecha(hoy)}`,
    );

    return opciones;
  }

  formatearFecha(fecha: Date): string {
    return formatDate(fecha, 'dd-MM-yyyy', 'en-US');
  }

  //! Recargar lista
  recargarLista() {
    const filtrosObj = this.filtrosBusqueda.reduce((acc, filtro) => {
      const key = Object.keys(filtro)[0];
      acc[key] = filtro[key];
      return acc;
    }, {});

    this.apiMovimientos
      .buscar_x_atributo(filtrosObj, this.paginaActual, this.porPagina)
      .subscribe({
        next: (data) => {
          this.datos = Object.values(data['msg']).flat();
          this.totalDatos = Math.max(1, data['total']);
          this.totalPaginas = Math.ceil(this.totalDatos / this.porPagina);
        },
        error: (error) => {
          console.error('ERROR al cargar ventas:', error);
        },
      });
  }

  //! Paginamiento
  clickPagina(numero: number) {
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
    switch (this.pagActual) {
      case 'ven':
        return 'Ventas';
      case 'dev':
        return 'Devoluciones';
      case 'mov':
        return 'Movimientos';
      case 'tf':
        return 'Tienda Física';
      case 'to':
        return 'Tienda Online';
      case 'usu':
        return 'Usuarios';
      default:
        return 'Página Actual';
    }
  }
}
