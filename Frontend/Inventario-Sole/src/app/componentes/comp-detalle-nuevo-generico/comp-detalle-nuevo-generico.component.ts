import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Campo } from '../../interfaces/campo.interface';

@Component({
  selector: 'app-comp-detalle-nuevo-generico',
  templateUrl: './comp-detalle-nuevo-generico.component.html',
  styleUrls: ['./comp-detalle-nuevo-generico.component.css']
})
export class CompDetalleNuevoGenericoComponent implements OnInit {
  
  @Input() estilo: string = "normal";  //! "normal" o "compacto"
  @Input() titulo: string = "Nuevo Detalle";
  @Input() campos: Campo[] = [];  //! Nombre, identificador y tipo. Ej: "Cantidad", "cantidad", "input-number"
  
  @Output() datosRecolectados = new EventEmitter<any[]>();
  
  constructor() { }

  ngOnInit(): void { }

  recolectarDatos(): void {
    let datos: any[] = [];
    
    this.campos.forEach(campo => {
      const element = document.getElementById(campo.identificador) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

      if (element) {
        let valor: any;

        if (element.tagName === 'INPUT' && (element as HTMLInputElement).type === 'number') {
          valor = (element as HTMLInputElement).valueAsNumber;
        } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          valor = element.value;
        } else if (element.tagName === 'SELECT') {
          valor = (element as HTMLSelectElement).value;
        }

        datos.push({ nombre2: campo.nombre, valor: valor });
      }
    });

    this.datosRecolectados.emit(datos);
  }
}