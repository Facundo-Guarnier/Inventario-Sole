import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Campo } from '../../interfaces/campo.interface';

@Component({
  selector: 'app-comp-detalle-nuevo-generico',
  templateUrl: './comp-detalle-nuevo-generico.component.html',
  styleUrls: ['./comp-detalle-nuevo-generico.component.css']
})
export class CompDetalleNuevoGenericoComponent implements OnInit {
  
  //! Para mostrar la opción de editar o no
  @Input() mostrarEditar: boolean = false;

  @Input() estilo: string = "normal";  //! "normal" o "compacto"
  @Input() titulo: string = "Nuevo Detalle";
  @Input() campos: Campo[] = [];  //! Nombre, identificador y tipo. Ej: "Cantidad", "cantidad", "input-number"
  
  @Output() datosRecolectados = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit(): void { 
  }

  recolectarDatos(): void {
    let datos: any = {};
    
    this.campos.forEach(campo => {
      if (campo.tipo === 'selector-multiple') {
        datos[campo.identificador] = campo.seleccionados || [];
      } else {
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
          
          datos[campo.identificador] = valor;
        }
      }
    });
  
    this.datosRecolectados.emit(datos);
  }

  onCheckboxChange(campo: any, opcion: string, event: any) {
    const checked = event.target.checked;
    
    if (!campo.seleccionados) {
      campo.seleccionados = [];
    }
    
    if (checked) {
      campo.seleccionados.push(opcion);
    } else {
      const index = campo.seleccionados.indexOf(opcion);
      if (index > -1) {
        campo.seleccionados.splice(index, 1);
      }
    }
  }
}