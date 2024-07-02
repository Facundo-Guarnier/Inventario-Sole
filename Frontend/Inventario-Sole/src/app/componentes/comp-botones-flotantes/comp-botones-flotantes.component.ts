import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comp-botones-flotantes',
  templateUrl: './comp-botones-flotantes.component.html',
  styleUrls: ['./comp-botones-flotantes.component.css']
})
export class CompBotonesFlotantesComponent implements OnInit {

  @Input() mostrarCheck: boolean = false; // Controla la visibilidad del botón "check"
  @Input() mostrarX: boolean = false;       // Controla la visibilidad del botón "x"
  @Input() mostrarTrash: boolean = false;    // Controla la visibilidad del botón "trash"

  @Output() checkClick = new EventEmitter<void>(); 
  @Output() xClick = new EventEmitter<void>();
  @Output() trashClick = new EventEmitter<void>();
  
  onClickCheck() {
    this.checkClick.emit();
  }
  
  onClickX() {
    this.xClick.emit();
  }
  
  onClickTrash() {
    this.trashClick.emit();
  }
  
  constructor(private cdRef: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    this.cdRef.detectChanges(); //! Fuerza a Angular a realizar una verificación de cambios en este componente y sus hijos.
  }

}
