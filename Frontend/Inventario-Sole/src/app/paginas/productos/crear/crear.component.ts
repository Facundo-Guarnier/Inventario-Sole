import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CompDetalleNuevoComponent } from 'src/app/componentes/comp-detalle-nuevo-prod/comp-detalle-nuevo-prod.component';
import { Campo } from 'src/app/interfaces/campo.interface';
import { Dominio } from 'src/app/interfaces/dominio.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiMeliService } from 'src/app/services/meli/api-meli.service';
import { ApiProductosService } from 'src/app/services/productos/api-producto.service';
import { UltimasIDsService } from 'src/app/services/ultimaID/ultimas-ids.service';


@Component({
  selector: 'pag-productos-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css'],
})

export class PagProductosCrearComponent implements OnInit, AfterViewInit {

  //! Ver los componentes hijos
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild(CompDetalleNuevoComponent) compDetalleNuevo!: CompDetalleNuevoComponent;
  
  
  //! Para mostrar la opción de editar o no
  mostrarEditar: boolean = true;
  tituloGeneral: string = "";
  
  //! Botones flotantes
  mostrarAceptar = true;
  mostrarCancelar = true;
  
  //! Producto
  camposGenerales: Campo[] = [
    { nombre: "ID", identificador: "id", tipo: "readonly" },
    { nombre: "Código Mercado Shop", identificador: "cod_ms", tipo: "input-text" },
    
    { nombre: "Titulo (sin talle, color o descuento)", identificador: "titulo", tipo: "input-text"},
    // { nombre: "Marca (si no es oficial, escriba 'generico')", identificador: "marca", tipo: "input-text"},
    
    // { nombre: "Descripcion", identificador: "descripcion", tipo: "textarea-text"},
    // { nombre: "Talle", identificador: "talle", tipo: "input-text"},
    { nombre: "Liquidacion", identificador: "liquidacion", tipo: "boolean", valor: false },
  ];
  
  camposFisica: Campo[] = [
    { nombre: "Precio", identificador: "precio", tipo: "input-number" },
    { nombre: "Cantidad", identificador: "cantidad", tipo: "input-number" },
  ];
  
  camposOnline: Campo[] = [
    { nombre: "Precio", identificador: "precio", tipo: "input-number" },
    { nombre: "Cantidad", identificador: "cantidad", tipo: "input-number" },
  ];
  
  //! Fotos
  fotos: {filename: string, url: SafeUrl}[] = [];
  id:string = ""
  
  //! Modal
  estaAbierto = false;
  tituloModal = "titulo";
  mensajeModal = "mensaje";
  redireccionar: boolean = false;
  
  //! Vista
  showNavbar = false;
  showSidebar = false;

  //! Variables según el dominio
  dominios: Dominio[] = [
    // {domain_id: 'MLA-T_SHIRTS', domain_name: 'Remeras', category_id: 'MLA414238', category_name: 'Remeras, Musculosas y Chombas'},
  ];
  dominioSeleccionado:Dominio = {};
  requiredAttributes: {}[] = [];

  //* ------------------------------------------------------------
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private apiProductos: ApiProductosService,
    private ultimasIDs: UltimasIDsService,
    private apiMeli: ApiMeliService,
  ) {}
  
  ngOnInit(): void {
    //! Buscar la id
    this.ultimasIDs.buscar_proxima_id("producto", this.authService.getToken()).subscribe(
      (id) => {
        this.id = id;
        this.camposGenerales[0].valor = this.id;
      },
      (err) => {
        console.error("Error al buscar la última ID:", err);
      }
    );
    
    this.tituloGeneral = "Crear producto";
  }
  
  ngAfterViewInit() {
    if (this.fileInput) {
      this.fileInput.nativeElement.style.display = 'none';
    }
  }
  
  //T* Funciones



  //! Actualizar campos
  async onChange(event: {identificador: string, valor: string}) {
    console.log('Evento:', event);
    if (event.identificador === 'titulo') {
      
      //! Buscar el dominio del producto en base al titulo
      this.apiMeli.get("/sites/MLA/domain_discovery/search?q=" + event.valor, this.authService.getToken()).subscribe(
      // this.apiMeli.get("/users/me", this.authService.getToken()).subscribe(
        (res: any) => {
          this.dominios = res;
          console.log('Dominios:', this.dominios);
          let dominios_nombre: string[] = this.dominios.map((dominio: any) => dominio.category_name);
          
          //! Verificar si existe el campo dominio
          //TODO: Agregar mas descripcion a los dominios, todos se llaman iguales pero son distintos (hombre, mujer, niño, bebe)
          let campoDominioIndex = this.camposGenerales.findIndex(campo => campo.identificador === 'dominio');
          if (campoDominioIndex !== -1) {
            //! Borrar el campo existente
            this.camposGenerales.splice(campoDominioIndex, 1);
          }
          //! Crear un nuevo campo "dominio"
          this.camposGenerales.push({ nombre: "Dominio", identificador: "dominio", tipo: "selector", opciones: dominios_nombre });
          
          
        },
        (err: any) => {
          console.error('Error al buscar en Meli:', err);
        }
      );
    }

    if (event.identificador === "dominio") {
      //! Debería buscar:
      //! - los atributos obligatorios
      //! - las guías de talles (si es que es obligatoria)

      //TODO: ver bien cual de todos los dominios puede ser el correcto
      this.dominioSeleccionado = this.dominios.find((dominio: Dominio) => dominio.category_name === event.valor) || {};
      console.log('Dominio seleccionado:', this.dominioSeleccionado);
      
      
      //! Buscar los atributos obligatorios
      if (this.dominioSeleccionado && this.dominioSeleccionado["category_id"]) {
        this.apiMeli.get("/categories/" + this.dominioSeleccionado["category_id"] + "/attributes", this.authService.getToken()).subscribe(
          (res: any) => {
            
            //! Almacenar los atributos requeridos
            const requiredAttributes = res.filter((attribute: any) => attribute.tags && attribute.tags.required === true);
            this.requiredAttributes = requiredAttributes;
            console.log('1 - Atributos obligatorios:', this.requiredAttributes);

          },
          (err: any) => {
            console.error('Error al buscar en Meli:', err);
          }
        );

      }




      //! Buscar las guías de talles
      let search_charts_payload:{} = {
          "domain_id": "T_SHIRTS",
          "site_id": "MLA",
          "seller_id":  "327259941",    //TODO: Cambiar por la ID de la cuenta de la sole
          "attributes": [
              {
                  "id": "GENDER",
                  "values": [
                      {
                          "name": "Mujer"
                      }
                  ]
              },
              {
                  "id": "BRAND",
                  "values": [
                      {
                          "name": "generico"
                      }
                  ]
              }
          ]
      };
      this.apiMeli.post("/catalog/charts/search", JSON.stringify(search_charts_payload), this.authService.getToken()).subscribe(
        (res: any) => {
          console.log('2 - Guias de talles:', res);
        },
        (err: any) => {
          console.error('Error al buscar en Meli:', err);
        }
      );



    }

  }




  //! Botones flotantes
  ClickAceptar() {
    this.compDetalleNuevo.recolectarDatos();
    
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
    
    //! Crear el producto
    this.apiProductos.crear(producto, this.authService.getToken()).subscribe(
      (res: any) => {
        console.log('Producto creado:', res);
        this.tituloModal = "Producto creado";
        this.mensajeModal = "El producto se ha creado correctamente.";
        this.redireccionar = true;
        this.openModal();
      },
      (err: any) => {
        console.error('Error al crear el producto:', err);
        this.tituloModal = "Error al crear";
        this.mensajeModal = "Ha ocurrido un error al crear el producto. Error: " + err["error"]["msg"];
        this.openModal();
      }
    );
  }
  ClickCancelar() {
    this.router.navigate(['/to']);
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
  
  //! Botones de vista
  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
    if (this.showNavbar) {
      this.showSidebar = false;
    }
  }
  
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    if (this.showSidebar) {
      this.showNavbar = false;
    }
  }
}