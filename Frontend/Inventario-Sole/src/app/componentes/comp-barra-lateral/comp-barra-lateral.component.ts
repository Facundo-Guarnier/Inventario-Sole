import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comp-barra-lateral',
  templateUrl: './comp-barra-lateral.component.html',
  styleUrls: ['./comp-barra-lateral.component.css']
})
export class CompBarraLateralComponent implements OnInit {

    //! Variables para mostrar o no los elementos
    @Input() mostrarDetalleActual: boolean = false;
    @Input() mostrarBuscador: boolean = false;
    
  constructor() { }

  ngOnInit(): void {
  }

}
