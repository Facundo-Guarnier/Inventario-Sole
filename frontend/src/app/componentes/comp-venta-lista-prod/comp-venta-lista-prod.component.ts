import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Campo } from 'src/app/interfaces/campo.interface';

@Component({
  selector: 'app-comp-venta-lista-prod',
  templateUrl: './comp-venta-lista-prod.component.html',
  styleUrls: ['./comp-venta-lista-prod.component.css'],
})
export class CompVentaListaProdComponent implements OnInit, OnChanges {
  //! Para mostrar la opción de editar o no
  @Input() mostrarEditar: boolean = false;

  @Output() datosRecolectados = new EventEmitter<any[]>();
  @Input() estilo: string = 'normal'; //! "normal" o "compacto"
  @Input() titulo: string = 'Nuevo Detalle';
  @Input() campos: Campo[] = []; //! Nombre, identificador y tipo. Ej: "Cantidad", "cantidad", "input-number"

  @Input() datosOriginales: any[] = [];

  productos: any[] = [{}];

  //! Función para buscar el precio
  @Input() buscarPrecioProducto!: (idProducto: string) => void;

  //* ------------------------------------------------------------

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.actualizarProductos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosOriginales']) {
      this.actualizarProductos();
    }

    if (changes['mostrarEditar']) {
      this.actualizarProductos();
    }
  }

  //T* Funciones
  actualizarProductos(): void {
    if (this.datosOriginales && this.datosOriginales.length > 0) {
      this.productos = [...this.datosOriginales];
    }
  }

  agregarProducto() {
    this.productos.push({});
  }

  quitarProducto(index: number) {
    this.productos.splice(index, 1);
  }

  //! Recolectar datos de los productos para componente padre
  recolectarDatos() {
    const datosRecolectados = this.productos.map((producto, index) => {
      const datosProducto: any = { ...producto }; // Comenzar con los datos existentes
      this.campos.forEach((campo) => {
        const elemento = document.getElementById(
          `${campo.identificador}_${index}`,
        ) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (elemento) {
          datosProducto[campo.identificador] = elemento.value;
        } else {
          console.error(
            `Elemento con id ${campo.identificador}_${index} no encontrado.`,
          );
        }
      });
      return datosProducto;
    });

    this.datosRecolectados.emit(datosRecolectados);
    return datosRecolectados;
  }

  //! Actualizar el precio de un producto
  actualizarPrecioProducto(idProducto: string, precio: number) {
    const index = this.productos.findIndex((p) => p.idProducto === idProducto);
    if (index !== -1) {
      this.productos[index] = {
        ...this.productos[index],
        precio_original: precio,
      };
      this.cdr.detectChanges();
    }
  }
  onInputChange(index: number, event: Event) {
    const idProducto = (event.target as HTMLInputElement).value;
    if (idProducto) {
      this.buscarPrecioProducto(idProducto);
    }
  }
  obtenerProductos() {
    return this.productos;
  }
}
