import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Campo } from 'src/app/interfaces/campo.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiProductosService } from 'src/app/services/productos/api-producto.service';
import { UltimasIDsService } from 'src/app/services/ultimaID/ultimas-ids.service';

@Component({
  selector: 'pag-productos-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css'],
})
export class PagProductosCrearComponent implements OnInit, AfterViewInit {

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

  //! Producto
  camposGenerales: Campo[] = [
    { nombre: "ID", identificador: "id", tipo: "readonly" },
    { nombre: "Código Mercado Shop", identificador: "cod_ms", tipo: "input-text" },
    { nombre: "Marca", identificador: "marca", tipo: "input-text"},
    { nombre: "Descripcion", identificador: "descripcion", tipo: "textarea-text"},
    { nombre: "Talle", identificador: "talle", tipo: "input-text"},
    { nombre: "Liquidacion", identificador: "liquidacion", tipo: "boolean" },
  ];
  
  camposFisica: Campo[] = [
    { nombre: "Precio", identificador: "precio", tipo: "input-number" },
    { nombre: "Cantidad", identificador: "cantidad", tipo: "input-number" },
  ];
  
  camposOnline: Campo[] = [
    { nombre: "Precio", identificador: "precio", tipo: "input-number" },
    { nombre: "Cantidad", identificador: "cantidad", tipo: "input-number" },
  ];
  
  fotos: any[] = [];
  id = "";
  mostrarEditar = true;
  
  //* ------------------------------------------------------------

  constructor(
    private apiProducto: ApiProductosService,
    private authService: AuthService,
    private ultimasIDs: UltimasIDsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    //! Buscar id
    this.ultimasIDs.buscar_proxima_id("producto", this.authService.getToken()).subscribe(
      (id) => {
        this.id = id;
        this.camposGenerales[0].valor = this.id;
      },
      (err) => {
        console.error("Error al buscar la última ID:", err);
      }
    );
    
  }

  ngAfterViewInit() {
    if (this.fileInput) {
      this.fileInput.nativeElement.style.display = 'none';
    }
  }

  //T* Funciones
  //! Botones flotantes
  clickAceptar() {
    console.log('Click en Aceptar');
  }
  clickCancelar() {
    this.router.navigate(['/tf']);
  }

  //! Para agregar una foto
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