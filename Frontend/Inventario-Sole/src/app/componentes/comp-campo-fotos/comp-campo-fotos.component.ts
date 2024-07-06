import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comp-campo-fotos',
  templateUrl: './comp-campo-fotos.component.html',
  styleUrls: ['./comp-campo-fotos.component.css']
})
export class CompCampoFotosComponent implements OnInit {

  @Output() clickAgregarFoto = new EventEmitter<void>();
  @Output() archivoSeleccionado = new EventEmitter<Event>();


  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  
  ClickAgregarFoto() {
    this.clickAgregarFoto.emit();
  }

  ArchivoSeleccionado(event: Event) {
    this.archivoSeleccionado.emit();
  }
}
