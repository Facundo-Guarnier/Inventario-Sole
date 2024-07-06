import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filtro } from '../../models/filtro.interface'

@Component({
  selector: 'app-comp-barra-lateral',
  templateUrl: './comp-barra-lateral.component.html',
  styleUrls: ['./comp-barra-lateral.component.css']
})
export class CompBarraLateralComponent implements OnInit {

  @Input() listaFiltros: Filtro[] = [];

  pagActual: string = '';

  
  mostrarBusqueda(): boolean {
    //! Activa o desactiva la barra de busqueda en base a la pag actual.
    return ['tf', 'to', 'gc', 'reg', 'ven', 'mov'].includes(this.pagActual);
  }
  
  mostrarFiltroListaSeleccion(): boolean {
    //! Activa o desactiva el filtro de lista de seleccion en base a la pag actual.
    return ['tf', 'to', 'gc', 'reg', 'ven', 'mov'].includes(this.pagActual);
  }

  mostrarFiltroCheckbox(): boolean {
    //! Activa o desactiva el filtro de checkbox en base a la pag actual.
    return ['tf', 'to', 'gc', 'reg', 'ven', 'mov'].includes(this.pagActual);
  }

  mostrarDetalleLateral(): boolean {
    //! Activa o desactiva el detalle lateral en base a la pag actual.
    return ['prod'].includes(this.pagActual);
  }

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pagActual = this.router.url.split('/')[1].split('?')[0];

    this.listaFiltros = [
      {nombre: 'Filtro 1', opciones: ['Opcion 1', 'Opcion 2']},
      {nombre: 'Filtro 2', opciones: ['Opcion 1', 'Opcion 2', 'Opcion 3']},
      {nombre: 'Filtro 3', opciones: ['Opcion 1', 'Opcion 2', 'Opcion 3', 'Opcion 4']},
      {nombre: 'Filtro 4', opciones: ['Opcion 1', 'Opcion 2']}
    ]
  }

}
