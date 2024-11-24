import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Filtro } from '../../interfaces/filtro.interface'


@Component({
  selector: 'app-comp-filtro-lista-seleccion',
  templateUrl: './comp-filtro-lista-seleccion.component.html',
  styleUrls: ['./comp-filtro-lista-seleccion.component.css']
})
export class CompFiltroListaSeleccionComponent implements OnInit {
  
  @Input() filtro: Filtro = {nombre: '', identificador:"", opciones: []};
  @Output() clickFiltro = new EventEmitter<{nombre: string, valor: string}>();
  
  //* ------------------------------------------------------------
  
  constructor() { }
  
  ngOnInit(): void {
  }
  
  //T* Funciones
  ClickFiltro(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.clickFiltro.emit(
      { 
        nombre: this.filtro.identificador, 
        valor: selectedValue 
      });
  }
}
