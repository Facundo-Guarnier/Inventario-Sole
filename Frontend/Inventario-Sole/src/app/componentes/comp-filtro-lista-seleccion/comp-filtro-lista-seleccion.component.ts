import { Component, Input, OnInit } from '@angular/core';
import { Filtro } from '../../interfaces/filtro.interface'


@Component({
  selector: 'app-comp-filtro-lista-seleccion',
  templateUrl: './comp-filtro-lista-seleccion.component.html',
  styleUrls: ['./comp-filtro-lista-seleccion.component.css']
})
export class CompFiltroListaSeleccionComponent implements OnInit {

  @Input() filtro: Filtro = {nombre: '', opciones: []};

  constructor() { }

  ngOnInit(): void {
  }

}
