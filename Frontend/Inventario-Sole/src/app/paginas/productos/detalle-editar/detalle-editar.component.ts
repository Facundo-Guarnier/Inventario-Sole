import { identifierName } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campo } from 'src/app/interfaces/campo.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiProductoService } from 'src/app/services/productos/api-producto.service';


@Component({
  selector: 'pag-productos-editar',
  templateUrl: './detalle-editar.component.html',
  styleUrls: ['./detalle-editar.component.css']
})

export class PagProductosDetalleEditarComponent implements OnInit {
  
  //! Ver los componentes hijos
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  
  //! Para mostrar la opción de editar o no
  mostrarEditar: boolean = false;
  tituloGeneral: string = "";
  
  //! Botones flotantes
  mostrarBorrar = false;
  mostrarAceptar = false;
  mostrarCancelar = false;

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
  
  //* ------------------------------------------------------------
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private apiProducto: ApiProductoService,
  ) {}
  
  ngOnInit(): void {
    //! Obtener parametro de "editar" la URL
    this.route.queryParams.subscribe(params => {
      this.mostrarEditar = params['editar'] === 'true'; //! Se compara con true porque originalmente es un string
    });
    
    if (this.mostrarEditar === undefined) {
      this.mostrarEditar = true;
    }
    
    if (this.mostrarEditar) {
      this.tituloGeneral = "Editar detalle de producto";
      this.mostrarAceptar = true;
      this.mostrarCancelar = true;
      this.mostrarBorrar = true;
    } else {
      this.tituloGeneral = "Ver detalle de producto";
    }
    
    //! Buscar la venta
    let id = this.router.url.split("?")[0].split('/').pop();
    if (id === undefined) {
      console.error('No se encontró el ID');
      this.router.navigate(['/prod']);
      return;
    }
    this.apiProducto.buscar_x_id(id).subscribe(
      (res: any) => {
        let datos = res["msg"][0]
        console.log('Datos:', datos);
        //! Detalles generales
        this.camposGenerales[0].valor = datos["id"];
        this.camposGenerales[1].valor = datos["cod_ms"];
        this.camposGenerales[2].valor = datos["marca"];
        this.camposGenerales[3].valor = datos["descripcion"];
        this.camposGenerales[4].valor = datos["talle"];
        this.camposGenerales[5].valor = datos["liquidacion"];
        
        //! Detalles física
        this.camposFisica[0].valor = datos["fisica"]["precio"];
        this.camposFisica[1].valor = datos["fisica"]["cantidad"];
        
        //! Detalles online
        this.camposOnline[0].valor = datos["online"]["precio"];
        this.camposOnline[1].valor = datos["online"]["cantidad"];
        
        //! Fotos
        this.fotos = datos["fotos"];
      },
      
      (err: any) => {
        console.error('Error al buscar la venta:', err);
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
  ClickAceptar() {
    console.log('Botón "aceptar" presionado');
  }
  ClickCancelar() {
    console.log('Botón "cancelar" presionado');
  }
  ClickBorrar() {
    console.log('Botón "borrar" presionado');
  }
  
  //! Boton agregar foto
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
