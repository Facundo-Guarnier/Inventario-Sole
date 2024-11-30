import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comp-filtro-checkbox',
  templateUrl: './comp-filtro-checkbox.component.html',
  styleUrls: ['./comp-filtro-checkbox.component.css']
})
export class CompFiltroCheckboxComponent implements OnInit {
  @Input() filtro: {
    nombre: string;
    identificador: string;
    seleccionado: boolean;
  } = { nombre: '', identificador: '', seleccionado: false };
  @Output() clickFiltro = new EventEmitter<{ nombre: string; valor: string }>();

  //* ------------------------------------------------------------

  constructor() {}

  ngOnInit(): void {}

  //T* Funciones
  ClickFiltro(filtro: any) {
    if (filtro.seleccionado) {
      this.clickFiltro.emit({ nombre: filtro.identificador, valor: 'true' });
    } else {
      this.clickFiltro.emit({ nombre: filtro.identificador, valor: 'false' });
    }
  }
}
