import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-comp-campo-fotos',
  templateUrl: './comp-campo-fotos.component.html',
  styleUrls: ['./comp-campo-fotos.component.css']
})

export class CompCampoFotosComponent implements OnInit {
  
  //! Para mostrar la opción de editar o no
  @Input() mostrarEditar: boolean = false;
  
  @Output() clickAgregarFoto = new EventEmitter<void>();
  @Output() archivoSeleccionado = new EventEmitter<Event>();
  
  @Input() listaFotos: string[] = [];
  
  //* ------------------------------------------------------------
  
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