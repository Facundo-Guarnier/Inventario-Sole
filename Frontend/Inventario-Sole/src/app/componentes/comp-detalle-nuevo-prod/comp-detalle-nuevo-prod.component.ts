import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
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
  
  private changeSubject = new Subject<{identificador: string, valor: any}>();

  //* ------------------------------------------------------------
  
  constructor() {

    //! Delay antes de activar el evento
    this.changeSubject.pipe(
      debounceTime(1500), // espera X ms después de la última emisión
      distinctUntilChanged((prev, curr) => 
        prev.identificador === curr.identificador && prev.valor === curr.valor
      )
    ).subscribe(change => {
      this.onChange.emit(change);
    });
  }
  
  ngOnInit(): void {
  }

  //T* Funciones


  //! Actualizar campos
  OnChange(campo: Campo, event: any) {
    let valor: any;
    if (event.target) {
      valor = event.target.value;
    } else {
      valor = event;
    }
    this.changeSubject.next({
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