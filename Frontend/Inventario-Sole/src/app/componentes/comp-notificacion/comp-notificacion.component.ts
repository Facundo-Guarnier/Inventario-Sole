import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comp-notificacion',
  templateUrl: './comp-notificacion.component.html',
  styleUrls: ['./comp-notificacion.component.css']
})
export class CompNotificacionComponent implements OnInit {
  
  @Input() titulo: string = '';
  @Input() estaAbierto: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  
  constructor() { }
  
  ngOnInit(): void {
  }
  
    closeModal() {
      this.cerrar.emit();
    }

}
