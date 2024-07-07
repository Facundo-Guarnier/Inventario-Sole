import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Campo } from '../../interfaces/campo.interface'

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

  recolectarDatos() {
    const datosRecolectados = this.productos.map(producto => {
      const datosProducto: any = {};
      this.campos.forEach(campo => {
        const valor = (document.getElementById(`${campo.identificador}_${this.productos.indexOf(producto)}`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
        datosProducto[campo.identificador] = valor;
      });
      return datosProducto;
    });
    
    console.log('Datos recolectados:', datosRecolectados);
    this.datosRecolectados.emit(datosRecolectados);
    return datosRecolectados;
  }

}
