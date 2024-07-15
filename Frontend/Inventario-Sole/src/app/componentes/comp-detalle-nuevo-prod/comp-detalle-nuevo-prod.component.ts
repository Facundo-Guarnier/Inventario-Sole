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
    let datosRecolectados = [
      this.recolectarGrupo(this.detalleGeneral),
      this.recolectarGrupo(this.detalleFisica),
      this.recolectarGrupo(this.detalleOnline)
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