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

  @Output() onChange = new EventEmitter<{identificador: string, valor: string}>();
  
  //* ------------------------------------------------------------
  
  constructor() { }
  
  ngOnInit(): void {
  }

  //T* Funciones


  //! Actualizar campos
  OnChange(campo: Campo, event: any) {
    let valor: any;
    if (event.target) {
      // Para inputs, textareas, etc.
      valor = event.target.value;
    } else {
      // Para checkboxes y otros controles
      valor = event;
    }
    this.onChange.emit({
      identificador: campo.identificador,
      valor: valor
    });
  }





  recolectarDatos(): void {
    let datosRecolectados = [
      this.detalleGeneral,
      this.detalleFisica,
      this.detalleOnline
    ];
    
    this.datosRecolectados.emit(datosRecolectados);
  }
  
  private recolectarGrupo(grupo: any[]): any {
    return grupo.reduce((acc, campo) => {
      if (campo.tipo === 'selector-multiple') {
        acc[campo.identificador] = campo.seleccionados || [];
      } else {
        acc[campo.identificador] = campo.valor;
      }
      return acc;
    }, {});
  }
}