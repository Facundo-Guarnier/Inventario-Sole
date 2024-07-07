import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Campo } from '../../interfaces/campo.interface';

@Component({
  selector: 'app-comp-detalle-nuevo-generico',
  templateUrl: './comp-detalle-nuevo-generico.component.html',
  styleUrls: ['./comp-detalle-nuevo-generico.component.css']
})
export class CompDetalleNuevoGenericoComponent implements OnInit {
  @Output() datosRecolectados = new EventEmitter<any[]>();
  
  @Input() estilo: string = "normal";  //! "normal" o "compacto"
  @Input() titulo: string = "Nuevo Detalle";
  @Input() campos: Campo[] = [];  //! Nombre, identificador y tipo. Ej: "Cantidad", "cantidad", "input-number"
  
  productos: any[] = [{}]

  constructor() { }

  ngOnInit(): void {
  }

  agregarProducto() {
    this.productos.push({});
  }

  quitarProducto() {
    this.productos.pop();
  }

  recolectarDatos() {
    const datosRecolectados = this.productos.map((producto, index) => {
      const datosProducto: any = {};
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
