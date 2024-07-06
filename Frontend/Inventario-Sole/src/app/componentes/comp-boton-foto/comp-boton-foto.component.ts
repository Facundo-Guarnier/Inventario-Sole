import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-comp-boton-foto',
  templateUrl: './comp-boton-foto.component.html',
  styleUrls: ['./comp-boton-foto.component.css']
})
export class CompBotonFotoComponent implements OnInit {
  
  @Output() clickAgregarFoto = new EventEmitter<void>();
  @Output() archivoSeleccionado = new EventEmitter<Event>();
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  
  constructor(
    private cdRef: ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
  }
  
  //! Agregar foto
  ClickAgregarFoto() {
    this.clickAgregarFoto.emit();
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }
  ArchivoSeleccionado(event: Event) {
    this.archivoSeleccionado.emit();
  }

}
