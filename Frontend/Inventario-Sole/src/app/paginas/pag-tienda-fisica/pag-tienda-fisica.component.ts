import { Component, OnInit } from '@angular/core';

import { CompBotonesFlotantesComponent } from '../../componentes/comp-botones-flotantes/comp-botones-flotantes.component';

@Component({
  selector: 'app-pag-tienda-fisica',
  templateUrl: './pag-tienda-fisica.component.html',
  styleUrls: ['./pag-tienda-fisica.component.css']
})

export class PagTiendaFisicaComponent implements OnInit {

  onCheckClick() {
    //! Lógica para el botón "check"
    console.log('Botón "check" presionado');
  }
  
  onXClick() {
    //! Lógica para el botón "x"
    console.log('Botón "x" presionado');
  }
  
  onTrashClick() {
    //! Lógica para el botón "trash"
    console.log('Botón "trash" presionado');
  }

  constructor() { }

  ngOnInit(): void {
    
    //! Botones flotantes
    declarations: [
      CompBotonesFlotantesComponent 
    ]
  }

}
