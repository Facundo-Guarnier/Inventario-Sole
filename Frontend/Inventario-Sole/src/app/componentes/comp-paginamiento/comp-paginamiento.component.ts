import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comp-paginamiento',
  templateUrl: './comp-paginamiento.component.html',
  styleUrls: ['./comp-paginamiento.component.css']
})
export class CompPaginamientoComponent implements OnInit {

  @Input() paginaActual: number = 1;
  @Input() totalPaginas: number = 1;
  @Output() clickPagina = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  ClickPagina(pagina: number): void {
    this.clickPagina.emit(pagina);
  }

}
