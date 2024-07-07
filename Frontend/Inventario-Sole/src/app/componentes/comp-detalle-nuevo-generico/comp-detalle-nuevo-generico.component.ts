import { Component, Input, OnInit } from '@angular/core';
import { Campo } from '../../interfaces/campo.interface'

@Component({
  selector: 'app-comp-detalle-nuevo-generico',
  templateUrl: './comp-detalle-nuevo-generico.component.html',
  styleUrls: ['./comp-detalle-nuevo-generico.component.css']
})
export class CompDetalleNuevoMovComponent implements OnInit {
  
  @Input() campos: Campo[] = [];  //! Nombre, identificador y tipo. Ej: "Cantidad", "cantidad", "input-number"
  
  constructor() { }

  ngOnInit(): void {
  }

}
