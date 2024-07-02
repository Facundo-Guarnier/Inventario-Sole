import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comp-botones-flotantes',
  templateUrl: './comp-botones-flotantes.component.html',
  styleUrls: ['./comp-botones-flotantes.component.css']
})
export class CompBotonesFlotantesComponent implements OnInit {

  //! Controlan la visibilidad de los botones
  @Input() mostrarAceptar: boolean = false;
  @Input() mostrarCancelar: boolean = false;
  @Input() mostrarBorrar: boolean = false;
  @Input() mostrarAgregar: boolean = false;

  //! Funciones que se ejecutan al hacer click en los botones
  @Output() clickAceptar = new EventEmitter<void>(); 
  @Output() clickCancelar = new EventEmitter<void>();
  @Output() clickBorrar = new EventEmitter<void>();
  @Output() clickAgregar = new EventEmitter<void>();
  
  ClickAceptar() {
    this.clickAceptar.emit();
  }
  
  ClickCancelar() {
    this.clickCancelar.emit();
  }
  
  ClickBorrar() {
    this.clickBorrar.emit();
  }
  
  ClickAgregar() {
    this.clickAgregar.emit();
  }
  
  constructor(private cdRef: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    this.cdRef.detectChanges(); //! Fuerza a Angular a realizar una verificación de cambios en este componente y sus hijos.
  }

}