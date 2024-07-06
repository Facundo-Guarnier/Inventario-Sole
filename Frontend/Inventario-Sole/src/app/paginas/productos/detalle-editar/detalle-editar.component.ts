import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'pag-productos-editar',
  templateUrl: './detalle-editar.component.html',
  styleUrls: ['./detalle-editar.component.css']
})
export class PagProductosDetalleEditarComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

  ClickAceptar() {
    //! Lógica para el botón "aceptar"
    console.log('Botón "aceptar" presionado');
  }
  
  ClickCancelar() {
    //! Lógica para el botón "cancelar"
    console.log('Botón "cancelar" presionado');
  }
  
  ClickBorrar() {
    //! Lógica para el botón "borrar"
    console.log('Botón "borrar" presionado');
  }

  ClickAgregar() {
    //! Lógica para el botón "agregar"
    console.log('Botón "agregar" presionado');
  }
  

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.fileInput) {
      this.fileInput.nativeElement.style.display = 'none';
    }
  }

  ClickAgregarFoto() {
    console.log('Click en Agregar Foto');
    if (!this.fileInput) {
      console.error('No se ha cargado el input');
      return;
    }

    if (this.isMobile()) {
      this.fileInput.nativeElement.capture = 'environment';
    }
    this.fileInput.nativeElement.click();
  }

  archivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    if (file) {
      console.log('Archivo seleccionado:');
      // TODO: Agregar aquí la lógica para subir la imagen
    }
  }

  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

}
