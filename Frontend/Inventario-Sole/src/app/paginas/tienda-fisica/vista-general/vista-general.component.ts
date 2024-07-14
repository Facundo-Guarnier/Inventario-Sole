import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filtro } from 'src/app/interfaces/filtro.interface';
import { ApiProductosService } from 'src/app/services/productos/api-producto.service';

// import { CompBotonesFlotantesComponent } from '../../componentes/comp-botones-flotantes/comp-botones-flotantes.component';

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
    { nombre: 'Descripción', identificador: "descripcion", tipo: 'text' },
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
  datos: any[] = [
    // {
    //   "ID producto": "AB120",
    //   "Marca": "Adidas",
    //   "Descripción": "Pantalon blanco deportivo con rayas negras",
    //   "Talle": "M",
    //   "Precio": 89000,
    //   "Cantidad": 50,
    //   "Liquidación": false
    // }, 
    // {
    //   "ID producto": "AB121",
    //   "Marca": "Nike",
    //   "Descripción": "Remera azul deportiva",
    //   "Talle": "M",
    //   "Precio": 45000,
    //   "Cantidad": 7,
    //   "Liquidación": true
    // },
    // {
    //   "ID producto": "AB122",
    //   "Marca": "AAA",
    //   "Descripción": "Remera deportiva Remera azul deportiva Remera  asd asd ada dasd ad aazul  a sda  asd asd 151 81 562deportiva Remera azul deportiva",
    //   "Talle": "XL",
    //   "Precio": 900000,
    //   "Cantidad": 2,
    //   "Liquidación": false
    // },
    // {
    //   "ID producto": "AB123",
    //   "Marca": "Adidas",
    //   "Descripción": "Campera",
    //   "Talle": "M",
    //   "Precio": 10000,
    //   "Cantidad": 1,
    //   "Liquidación": true
    // }
  ];
  
  //! Busqueda
  filtrosBusqueda: any[] = []
  filtrosLista: Filtro[] = []
  filtrosCheckbox: {nombre:string, identificador: string}[] = [
    {nombre: 'Liquidación', identificador: "liquidacion"},
  ]
  
  //* ------------------------------------------------------------
  
  constructor(
    private router: Router,
    private apiProductos: ApiProductosService,
  ) { }

  ngOnInit(): void {
    this.recargarLista();
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
  
    this.apiProductos.buscar_x_atributo(filtrosObj).subscribe({
      next: (data) => {
        this.datos = Object.values(data).flat().map((producto: any) => {
          const productoModificado = { ...producto };
          
          if (productoModificado.fisica) {
            productoModificado.precio = productoModificado.fisica.precio;
            productoModificado.cantidad = productoModificado.fisica.cantidad;
          }
          
          return productoModificado;
        });
    
        console.log('Datos:', this.datos);
      },
      error: (error) => {
        console.error('ERROR al cargar ventas:', error);
      }
    });
  }
}
