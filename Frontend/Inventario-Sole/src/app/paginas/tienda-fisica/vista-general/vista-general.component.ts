import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filtro } from 'src/app/interfaces/filtro.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiFotoService, ApiFotosService } from 'src/app/services/fotos/api-foto.service';
import { ApiProductosService } from 'src/app/services/productos/api-producto.service';


@Component({
  selector: 'pag-tienda-fisica-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})

export class PagTiendaFisicaVistaGeneralComponent implements OnInit {
  
  //! Tabla de datos
  columnas = [
    { nombre: 'ID producto', identificador: "id", tipo: 'text' },
    { nombre: 'Marca', identificador: "marca", tipo: 'text' },
    { nombre: 'Talle', identificador: "talle", tipo: 'text' },
    { nombre: 'Precio', identificador: "precio", tipo: 'currency' },
    { nombre: 'Cantidad', identificador: "cantidad", tipo: 'number' },
    { nombre: 'Liquidación', identificador: "liquidacion", tipo: 'boolean' }
  ];
  acciones = {
    editar: true,
    eliminar: false,
    detalle: true
  }
  datos: any[] = [];
  
  //! Busqueda
  filtrosBusqueda: any[] = []
  filtrosLista: Filtro[] = [
    {nombre: "Liquidación", identificador: "liquidacion", opciones: ["Sí", "No"]},
  ];
  filtrosCheckbox: {nombre:string, identificador: string, seleccionado:boolean}[] = [
    // {nombre: 'Liquidación', identificador: "liquidacion", seleccionado: false},
    { nombre: "Todos (con/sin stock)", identificador: "stock", seleccionado: false },
  ]
  
  
  //! Botones flotantes
  mostrarAgregar = false;
  mostrarRevisarStock = false;
  
  //! Paginamiento 
  paginaActual = 1;
  porPagina = 20;
  totalDatos = 0;
  totalPaginas = 0;
  
  //* ------------------------------------------------------------
  
  constructor(
    private router: Router,
    private apiProductos: ApiProductosService,
    private authService: AuthService,
  ) { }
  
  ngOnInit(): void {
    this.recargarLista();
    
    this.mostrarAgregar = this.authService.isAdmin();
    this.acciones.editar = this.authService.isAdmin();
    this.mostrarRevisarStock = this.authService.isAdmin();
  }
  
  //T* Funciones
  //! Botones flotantes
  ClickAgregar() {
    this.router.navigate(['prod/crear']);
  }
  ClickRevisarStock() {
    this.router.navigate(['tf/revisar-stock']);
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
  
  //! Recargar lista
  recargarLista(){
    const filtrosObj = this.filtrosBusqueda.reduce((acc, filtro) => {
      const key = Object.keys(filtro)[0];
      acc[key] = filtro[key];
      return acc;
    }, {});
    
    //! Filtrar por stock, para que se puedan mostrar los productos que no tienen stock
    if (filtrosObj["stock"] === "true") {
      delete filtrosObj["stock"];
      filtrosObj['tienda'] = 'todos';
    
    } else {
      filtrosObj['tienda'] = 'fisica';
      delete filtrosObj["stock"];
    }
    
    this.apiProductos.buscar_x_atributo(filtrosObj, this.paginaActual, this.porPagina).subscribe({
      next: (data) => {
        this.datos = Object.values(data["msg"]).flat().map((producto: any) => {
          const productoModificado = { ...producto };
          
          if (productoModificado.fisica) {
            productoModificado.precio = productoModificado.fisica.precio;
            productoModificado.cantidad = productoModificado.fisica.cantidad;
          }
          
          return productoModificado;
        });
        
        this.totalDatos = data["total"];
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
