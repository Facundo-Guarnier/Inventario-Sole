import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filtro } from '../../interfaces/filtro.interface'

@Component({
  selector: 'app-comp-barra-lateral',
  templateUrl: './comp-barra-lateral.component.html',
  styleUrls: ['./comp-barra-lateral.component.css']
})
export class CompBarraLateralComponent implements OnInit {

  @Input() filtrosLista: Filtro[] = [];
  @Input() filtrosCheckbox: string[] = [];

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
    //! Activa o desactiva el detalle lateral en base a la página actual.
    //! Evita aparecer en prod/crear
    const urlSegment = this.router.url.split('/')[1].split('?')[0];   
    const isProdCrear = this.router.url.startsWith('/prod/crear');

    return urlSegment === 'prod' && !isProdCrear;
}

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pagActual = this.router.url.split('/')[1].split('?')[0];

    this.filtrosLista = [
      {nombre: 'Filtro 1', opciones: ['Opción 1', 'Opción 2']},
      {nombre: 'Filtro 2', opciones: ['Opción 1', 'Opción 2', 'Opción 3']},
      {nombre: 'Filtro 3', opciones: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4']},
      {nombre: 'Filtro 4', opciones: ['Opción 1', 'Opción 2']}
    ]
  
    this.filtrosCheckbox = [
      'Checkbox 1', 
      'Checkbox 2', 
      'Checkbox 3', 
      'Checkbox 4'
    ]
  }

}
