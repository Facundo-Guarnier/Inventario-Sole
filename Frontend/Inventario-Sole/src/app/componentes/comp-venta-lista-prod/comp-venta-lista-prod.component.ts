import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Campo } from 'src/app/interfaces/campo.interface';

@Component({
  selector: 'app-comp-venta-lista-prod',
  templateUrl: './comp-venta-lista-prod.component.html',
  styleUrls: ['./comp-venta-lista-prod.component.css']
})
export class CompVentaListaProdComponent implements OnInit, OnChanges  {

  @Output() datosRecolectados = new EventEmitter<any[]>();
  @Input() estilo: string = "normal";  //! "normal" o "compacto"
  @Input() titulo: string = "Nuevo Detalle";
  @Input() campos: Campo[] = [];  //! Nombre, identificador y tipo. Ej: "Cantidad", "cantidad", "input-number"
  
  @Input() datosOriginales: any[] = [];

  productos: any[] = [{}];
  
  constructor() { }

  ngOnInit(): void {
    this.actualizarProductos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["datosOriginales"]) {
      this.actualizarProductos();
    }
  }

  actualizarProductos(): void {
    if (this.datosOriginales && this.datosOriginales.length > 0) {
      this.productos = [...this.datosOriginales];
    }

    console.log('Datos originales:', this.productos);
  }

  agregarProducto() {
    this.productos.push({});
  }

  quitarProducto(index: number) {
    this.productos.splice(index, 1);
  }

  recolectarDatos() {
    const datosRecolectados = this.productos.map((producto, index) => {
      const datosProducto: any = { ...producto };  // Comenzar con los datos existentes
      this.campos.forEach(campo => {
        const elemento = document.getElementById(`${campo.identificador}_${index}`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (elemento) {
          datosProducto[campo.identificador] = elemento.value;
        } else {
          console.error(`Elemento con id ${campo.identificador}_${index} no encontrado.`);
        }
      });
      return datosProducto;
    });

    this.datosRecolectados.emit(datosRecolectados);
    return datosRecolectados;
  }

}
