import { identifierName } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CompDetalleNuevoComponent } from 'src/app/componentes/comp-detalle-nuevo-prod/comp-detalle-nuevo-prod.component';
import { Campo } from 'src/app/interfaces/campo.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiFotoService } from 'src/app/services/fotos/api-foto.service';
import { ApiProductoService } from 'src/app/services/productos/api-producto.service';


@Component({
  selector: 'pag-productos-editar',
  templateUrl: './detalle-editar.component.html',
  styleUrls: ['./detalle-editar.component.css']
})

export class PagProductosDetalleEditarComponent implements OnInit {
  
  //! Ver los componentes hijos
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild(CompDetalleNuevoComponent) compDetalleNuevo!: CompDetalleNuevoComponent;
  
  
  //! Para mostrar la opción de editar o no
  mostrarEditar: boolean = false;
  tituloGeneral: string = "";
  
  //! Botones flotantes
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
  
  fotos: {filename: string, url: SafeUrl}[] = [];
  
  //! Modal
  estaAbierto = false;
  tituloModal = "titulo";
  mensajeModal = "mensaje";
  redireccionar: boolean = false;
  
  //* ------------------------------------------------------------
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private apiProducto: ApiProductoService,
    private apiFoto: ApiFotoService,
    private sanitizer: DomSanitizer,
  ) {}
  
  ngOnInit(): void {
    //! Obtener parametro de "editar" la URL
    this.route.queryParams.subscribe(params => {
      this.mostrarEditar = params['editar'] === 'true'; //! Se compara con true porque originalmente es un string
    });
    
    if (this.mostrarEditar === undefined) {
      this.mostrarEditar = false;
    }
    
    if (!this.authService.isAdmin()) {
      this.mostrarEditar = false;
    }
    
    if (this.mostrarEditar) {
      this.tituloGeneral = "Editar detalle de producto";
      this.mostrarAceptar = true;
      this.mostrarCancelar = true;
    } else {
      this.tituloGeneral = "Ver detalle de producto";
    }
    
    //! Buscar la venta
    let id = this.router.url.split("?")[0].split('/').pop();
    if (id === undefined) {
      console.error('No se encontró el ID');
      this.router.navigate(['/tf']);
      return;
    }
    this.apiProducto.buscar_x_id(id).subscribe(
      (res: any) => {
        let datos = res["msg"][0]
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
        
        // Fotos
        this.fotos = datos["fotos"].map((foto: string) => ({
          filename: foto,
          url: this.sanitizer.bypassSecurityTrustUrl(this.apiFoto.obtenerUrlFoto(foto))
        }));
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
    this.compDetalleNuevo.recolectarDatos();
    console.log('Campos generales:', this.camposGenerales);
    console.log('Campos física:', this.camposFisica);
    console.log('Campos online:', this.camposOnline);
    console.log('Fotos:', this.fotos);
    
    //! Verificar que todos los campos no estén vacíos
    this.verificarCamposVacios();
    
    //! Dar formato a los datos
    let producto = {
      id: this.camposGenerales[0].valor,
      cod_ms: this.camposGenerales[1].valor,
      marca: this.camposGenerales[2].valor,
      descripcion: this.camposGenerales[3].valor,
      talle: this.camposGenerales[4].valor,
      liquidacion: this.camposGenerales[5].valor,
      fisica: {
        precio: this.camposFisica[0].valor,
        cantidad: this.camposFisica[1].valor,
      },
      online: {
        precio: this.camposOnline[0].valor,
        cantidad: this.camposOnline[1].valor,
      },
      fotos: this.fotos.map(foto => foto.filename),
    };
    
    //! Verificar id
    if (producto.id === null || producto.id === undefined || producto.id === "" || typeof producto.id !== 'string') {
      console.error('No se ha encontrado el ID');
      return;
    }
    
    //! Actualizar el producto
    this.apiProducto.actualizar(producto.id, producto, this.authService.getToken()).subscribe(
      (res: any) => {
        console.log('Producto actualizado:', res);
        this.tituloModal = "Producto actualizado";
        this.mensajeModal = "El producto se ha actualizado correctamente.";
        this.redireccionar = true;
        this.openModal();
      },
      (err: any) => {
        console.error('Error al actualizar el producto:', err);
        this.tituloModal = "Error al actualizar";
        this.mensajeModal = "Ha ocurrido un error al actualizar el producto.";
        this.openModal();
      }
    );
  }
  ClickCancelar() {
    this.router.navigate(['/tf']);
  }
  
  //! Boton agregar foto
  ClickAgregarFoto() {
    if (!this.fileInput) {
      console.error('No se ha cargado el input');
      return;
    }
    if (this.isMobile()) {
      this.fileInput.nativeElement.capture = 'environment';
    }
    this.fileInput.nativeElement.click();
  }
  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  onFotosActualizadas(fotos: {filename: string, url: SafeUrl}[]) {
    this.fotos = fotos;
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
  
  //! Recolectar datos de los componentes hijos
  onDatosRecolectados(camposGenerales: any[]) {
    this.camposGenerales = camposGenerales[0];
    this.camposFisica = camposGenerales[1];
    this.camposOnline = camposGenerales[2];
  }
  
  //! Modal
  openModal() {
    this.estaAbierto = true;
  }
  cerrarModal() {
    this.estaAbierto = false;
    if (this.redireccionar) {
      this.router.navigate(['/tf']);
    }
  }
  
  //! Verificar campos vacíos
  verificarCamposVacios() {
    if (this.camposGenerales.some(campo => campo.valor === "" || campo.valor === null || campo.valor === undefined)) {
      console.error('Faltan campos por llenar');
      this.tituloModal = "Faltan campos por llenar";
      this.mensajeModal = "Por favor, llena todos los campos antes de continuar.";
      this.openModal();
      return;
    }
    
    if (this.camposFisica.some(campo => campo.valor === "" || campo.valor === null || campo.valor === undefined)) {
      console.error('Faltan campos por llenar');
      this.tituloModal = "Faltan campos por llenar";
      this.mensajeModal = "Por favor, llena todos los campos antes de continuar.";
      this.openModal();
      return;
    }
    
    if (this.camposOnline.some(campo => campo.valor === "" || campo.valor === null || campo.valor === undefined)) {
      console.error('Faltan campos por llenar');
      this.tituloModal = "Faltan campos por llenar";
      this.mensajeModal = "Por favor, llena todos los campos antes de continuar.";
      this.openModal();
      return;
    }
  }
}
