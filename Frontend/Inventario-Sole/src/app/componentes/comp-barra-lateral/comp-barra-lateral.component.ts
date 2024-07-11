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

  urlActual: string[] = this.router.url.split('?')[0].split('/').slice(1);
  
  mostrarBusqueda(): boolean {
    //! Activa o desactiva la barra de busqueda en base a la pag actual.
    if (this.urlActual.length > 1) {
      return false
    }
    return ['tf', 'to', 'gc', 'reg', 'ven', 'mov'].includes(this.urlActual[0]);
  }
  
  mostrarFiltroListaSeleccion(): boolean {
    //! Activa o desactiva el filtro de lista de seleccion en base a la pag actual.
    if (this.urlActual.length > 1) {
      return false
    }
    return ['tf', 'to', 'gc', 'reg', 'ven', 'mov'].includes(this.urlActual[0]);
  }

  mostrarFiltroCheckbox(): boolean {
    //! Activa o desactiva el filtro de checkbox en base a la pag actual.
    if (this.urlActual.length > 1) {
      return false
    }
    return ['tf', 'to', 'gc', 'reg', 'ven', 'mov'].includes(this.urlActual[0]);
  }

  mostrarDetalleLateral(): boolean {
    //! Activa o desactiva el detalle lateral en base a la página actual.
    // if (this.urlActual.length > 1) {
    //   return ["prod"].includes(this.urlActual[0]) && this.urlActual[1].includes('detalle-editar');
    // }
    return false;
}

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    
    //TODO Borrar, solo para pruebas
    this.filtrosLista = [
      {nombre: 'Filtro 1', opciones: ['Opción 1', 'Opción 2']},
      {nombre: 'Filtro 2', opciones: ['Opción 1', 'Opción 2', 'Opción 3']},
      {nombre: 'Filtro 3', opciones: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4']},
      {nombre: 'Filtro 4', opciones: ['Opción 1', 'Opción 2']}
    ]
    
    //TODO Borrar, solo para pruebas
    this.filtrosCheckbox = [
      'Checkbox 1', 
      'Checkbox 2', 
      'Checkbox 3', 
      'Checkbox 4'
    ]
  }

}