import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-comp-campo-fotos',
  templateUrl: './comp-campo-fotos.component.html',
  styleUrls: ['./comp-campo-fotos.component.css']
})
export class CompCampoFotosComponent implements OnInit {
  
  @Output() clickAgregarFoto = new EventEmitter<void>();
  @Output() archivoSeleccionado = new EventEmitter<Event>();
  
  listaFotos: string[] = [];
  
  constructor(
    private cdRef: ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
    this.listaFotos = [
      "foto1",
      "foto2",
      "foto3",
      "foto4",
      "foto5",
      "foto6",
      "foto7",
      "foto8",
      "foto9",
    ];
  }
  
  ClickAgregarFoto() {
    this.clickAgregarFoto.emit();
  }
  
  ArchivoSeleccionado(event: Event) {
    this.archivoSeleccionado.emit();
  }
}