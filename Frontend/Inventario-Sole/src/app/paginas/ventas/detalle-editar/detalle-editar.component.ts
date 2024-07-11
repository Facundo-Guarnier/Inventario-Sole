import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CompDetalleNuevoGenericoComponent } from 'src/app/componentes/comp-detalle-nuevo-generico/comp-detalle-nuevo-generico.component';
import { CompVentaListaProdComponent } from 'src/app/componentes/comp-venta-lista-prod/comp-venta-lista-prod.component';
import { Campo } from 'src/app/interfaces/campo.interface';
import { ApiVentaService } from 'src/app/services/ventas/api-venta.service';

@Component({
  selector: 'pag-ventas-detalle',
  templateUrl: './detalle-editar.component.html',
  styleUrls: ['./detalle-editar.component.css']
})

export class PagVentasDetalleEditarComponent implements OnInit {

  @ViewChild(CompVentaListaProdComponent) compVentaLista!: CompVentaListaProdComponent;
  @ViewChild(CompDetalleNuevoGenericoComponent) compDetalleNuevo!: CompDetalleNuevoGenericoComponent;

  //! Campos para el detalle de la venta
  titulo1 = "Detalle de la venta";
  campos1: Campo[] = [
    { nombre: "ID venta", identificador: "id", tipo: "readonly", valor: this.router.url.split("?")[0].split('/').pop()},
    { nombre: "Fecha", identificador: "fecha", tipo: "readonly"},
    { nombre: "Cliente", identificador: "cliente", tipo: "input-text"},
    { nombre: "Tienda", identificador: "tienda", tipo: "selector", opciones: ["Fisica", "Online"] },
    { nombre: "Método", identificador: "metodo", tipo: "textarea-text"},
    { nombre: "Comentario", identificador: "comentario", tipo: "textarea-text"}
  ];
  detalleventa: any[] = [];

  //! Campos para los productos de la venta
  titulo2 = "Productos";
  campos2: Campo[] = [
    { nombre: "ID producto", identificador: "id", tipo: "input-text" },
    { nombre: "Cantidad", identificador: "cantidad", tipo: "input-number" },
    { nombre: "Precio", identificador: "precio", tipo: "input-number" },
    { nombre: "Comentario", identificador: "comentario", tipo: "textarea-text"}
  ];
  productos: any[] = [];
  datosOriginalesProductos: any[] = [];

  constructor(
    private router: Router,
    private apiVenta: ApiVentaService
  ) { }

  ngOnInit(): void {
    this.apiVenta.buscar_x_id(this.router.url.split("?")[0].split('/').pop()).subscribe(
      (res: any) => {
        let datos = res["msg"][0]
        
        //! Detalle de la venta
        this.campos1[0].valor = datos["id"];
        this.campos1[1].valor = datos["fecha"];
        this.campos1[2].valor = datos["cliente"];
        this.campos1[3].valor = datos["tienda"];
        this.campos1[4].valor = datos["metodo"];
        this.campos1[5].valor = datos["comentario"];

        //! Productos de la venta
        this.datosOriginalesProductos = datos["productos"];
      },

      (err: any) => {
        console.log('Error al buscar la venta:', err);
      }
    );
  }

  //! Funciones de los botones
  clickAceptar() {
    this.compDetalleNuevo.recolectarDatos();
    this.compVentaLista.recolectarDatos();
  }

  onDatosRecolectadosVenta(datos: any[]) {
    this.detalleventa = datos;
  }
  
  onDatosRecolectadosProductos(datos: any[]) {
    this.productos = datos;
  }

}
