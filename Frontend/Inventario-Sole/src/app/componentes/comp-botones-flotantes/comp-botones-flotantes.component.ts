import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-comp-botones-flotantes',
  templateUrl: './comp-botones-flotantes.component.html',
  styleUrls: ['./comp-botones-flotantes.component.css']
})
export class CompBotonesFlotantesComponent implements OnInit, AfterViewInit {

  //! Controlan la visibilidad de los botones
  @Input() mostrarAceptar: boolean = false;
  @Input() mostrarCancelar: boolean = false;
  @Input() mostrarBorrar: boolean = false;
  @Input() mostrarAgregar: boolean = false;
  @Input() mostrarAgregarFoto: boolean = false;

  //! Funciones que se ejecutan al hacer click en los botones
  @Output() clickAceptar = new EventEmitter<void>(); 
  @Output() clickCancelar = new EventEmitter<void>();
  @Output() clickBorrar = new EventEmitter<void>();
  @Output() clickAgregar = new EventEmitter<void>();
  @Output() clickAgregarFoto = new EventEmitter<void>();
  

//* ---------------------------------------------------


  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;


//* ---------------------------------------------------

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
  
  // ClickAgregarFoto() {
  //   this.clickAgregarFoto.emit();
  // }
  
  constructor(private cdRef: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    this.cdRef.detectChanges(); //! Fuerza a Angular a realizar una verificación de cambios en este componente y sus hijos.
  }



//* ---------------------------------------------------

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

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files) {
    return;
  }

  const file = input.files[0];
  if (file) {
    console.log('Archivo seleccionado:', file.name);
    // TODO: Agregar aquí la lógica para subir la imagen
  }
}

private isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


}