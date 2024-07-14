import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Campo } from 'src/app/interfaces/campo.interface';

@Component({
  selector: 'app-comp-detalle-nuevo-prod',
  templateUrl: './comp-detalle-nuevo-prod.component.html',
  styleUrls: ['./comp-detalle-nuevo-prod.component.css']
})
export class CompDetalleNuevoComponent implements OnInit {

  //! Para mostrar la opción de editar o no
  @Input() mostrarEditar: boolean = false;

  @Output() datosRecolectados = new EventEmitter<any>();
  
  @Input() detalleGeneral: Campo[] = [];
  @Input() detalleFisica: Campo[] = [];
  @Input() detalleOnline: Campo[] = [];

  
  //* ------------------------------------------------------------
  
  constructor() { }
  
  ngOnInit(): void {
    console.log(this.mostrarEditar);
  }

  //T* Funciones
  recolectarDatos(): void {
    let datos: any = {};
    let datosRecolectados = [];
    
    this.detalleGeneral.forEach(campo => {
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

    datosRecolectados.push(datos);

    let datosFisica: any = {};
    this.detalleFisica.forEach(campo => {
      if (campo.tipo === 'selector-multiple') {
        datosFisica[campo.identificador] = campo.seleccionados || [];
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
          
          datosFisica[campo.identificador] = valor;
        }
      }
    });

    datosRecolectados.push(datosFisica);

    let datosOnline: any = {};
    this.detalleOnline.forEach(campo => {
      if (campo.tipo === 'selector-multiple') {
        datosOnline[campo.identificador] = campo.seleccionados || [];
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
          
          datosOnline[campo.identificador] = valor;
        }
      }
    });

    this.datosRecolectados.emit(datosRecolectados);
  }
}