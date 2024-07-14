import { Component, Input, OnInit } from '@angular/core';
import { Campo } from 'src/app/interfaces/campo.interface';

@Component({
  selector: 'app-comp-detalle-nuevo-prod',
  templateUrl: './comp-detalle-nuevo-prod.component.html',
  styleUrls: ['./comp-detalle-nuevo-prod.component.css']
})
export class CompDetalleNuevoComponent implements OnInit {

  //! Para mostrar la opción de editar o no
  @Input() mostrarEditar: boolean = false;
  
  @Input() detalleGeneral: Campo[] = [];
  @Input() detalleFisica: Campo[] = [];
  @Input() detalleOnline: Campo[] = [];
  
  //* ------------------------------------------------------------
  
  constructor() { }
  
  ngOnInit(): void {
    console.log(this.mostrarEditar);
  }
}