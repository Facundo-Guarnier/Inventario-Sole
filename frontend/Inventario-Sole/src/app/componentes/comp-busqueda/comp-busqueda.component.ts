import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comp-busqueda',
  templateUrl: './comp-busqueda.component.html',
  styleUrls: ['./comp-busqueda.component.css']
})
export class CompBusquedaComponent implements OnInit {

  @Output() clickBuscar = new EventEmitter<string>();
  palabraClave: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  ClickBuscar(palabra_clave: string) {
    this.clickBuscar.emit(palabra_clave);
  }
}
