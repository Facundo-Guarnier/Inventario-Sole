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


interface Attribute {
  id: string;
  name: string;
  values?: { name: string }[];
}

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
    { nombre: "Código Mercado Shop", identificador: "cod_ms", tipo: "readonly" },
    { nombre: "Titulo (sin talle, color o descuento)", identificador: "titulo", tipo: "input-text"},
    // { nombre: "Descripcion", identificador: "descripcion", tipo: "textarea-text"},
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
  requiredAttributes: Attribute[] = [];
  
  //! Guias de talles
  guiasTalles: any[] = [];
  guiaTalleSeleccionada: any = null;
  
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
    // console.log('Evento:', event);
    
    if (event.identificador === 'titulo') {
      this.buscar_dominio_x_titulo(event.valor);
    }
    
    if (event.identificador === "dominio") {
      this.seleccionarDominio(event.valor);
    }
  }


  //! Buscar el dominio del producto en base al titulo
  buscar_dominio_x_titulo(titulo:string) {
    this.guiasTalles = [];
    this.guiaTalleSeleccionada = null; // Reset la selección
    
    this.apiMeli.get("/sites/MLA/domain_discovery/search?q=" + titulo, this.authService.getToken()).subscribe(
      (res: any) => {
        
        
        //! Agregar path completo
        this.dominios = res.map((dominio: Dominio) => {
          this.apiMeli.get("/categories/" + dominio["category_id"], this.authService.getToken()).subscribe(
            (res: any) => {
              
              
              dominio.path_completo = res.path_from_root.map((path: any) => path.name).join(' > ');
              
              let dominios_nombre: string[] = this.dominios.map((dominio: any) => dominio.path_completo);
              
              //! Verificar si existe el campo dominio
              let campoDominioIndex = this.camposGenerales.findIndex(campo => campo.identificador === 'dominio');
              if (campoDominioIndex !== -1) {
                //! Borrar el campo existente
                this.camposGenerales.splice(campoDominioIndex, 1);
              }
              //! Crear un nuevo campo "dominio"
              this.camposGenerales.push({ nombre: "Dominio", identificador: "dominio", tipo: "selector", opciones: dominios_nombre });
              this.removerAtributosObligatorios();
            },
            
            (err: any) => {
              console.error('Error al buscar en Meli:', err);
            }
          );
          return dominio;
        });
        // console.log('Dominios:', this.dominios);
        
      },
      
      (err: any) => {
        console.error('Error al buscar en Meli:', err);
      }
    );
  }


  seleccionarDominio(path_completo: string) {
    //! Debería buscar:
    //! - los atributos obligatorios
    //! - las guías de talles (si es que es obligatoria)
    this.dominioSeleccionado = this.dominios.find((dominio: Dominio) => dominio.path_completo === path_completo) || {};
    // console.log('Dominio seleccionado:', this.dominioSeleccionado);
    
    this.buscar_atributos_obligatorios();
    
    if (this.dominioSeleccionado["domain_id"] === undefined) {
      return;
    }


    //! Buscar las guías de talles
    let search_charts_payload:{} = {
        "domain_id": this.dominioSeleccionado["domain_id"].slice(4),
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
        console.log('1 - Guias de talles:', res);
        this.guiasTalles = res.charts || [];
        console.log('2 - Guias de talles:', this.guiasTalles);
        this.guiaTalleSeleccionada = null; // Reset la selección
      },
      (err: any) => {
        console.error('Error al buscar en Meli:', err);
      }
    );
  }


  //! Buscar los atributos obligatorios del dominio seleccionado
  buscar_atributos_obligatorios() {
    this.apiMeli.get("/categories/" + this.dominioSeleccionado["category_id"] + "/attributes", this.authService.getToken()).subscribe(
      (res: any) => {
        
        this.removerAtributosObligatorios();
        //! Almacenar los atributos requeridos
        this.requiredAttributes = res.filter((attribute: any) => attribute.tags && attribute.tags.required === true);
        // console.log('1 - Atributos obligatorios:', this.requiredAttributes);
        this.agregarAtributosObligatorios();
        
        //TODO Agregar en el backend los atributos obligatorios para guardarlos en la db
        
      },
      (err: any) => {
        console.error('Error al buscar en Meli:', err);
      }
    );
  }













  seleccionarGuiaTalle(guia: any) {
    this.guiaTalleSeleccionada = guia;
  }




  agregarAtributosObligatorios() {

    // Agregar los nuevos atributos obligatorios
    this.requiredAttributes.forEach((attribute: any) => {
      const campo: Campo = {
        nombre: attribute.name,
        identificador: attribute.id,
        tipo: attribute.values && attribute.values.length > 0 ? 'selector' : 'input-text',
        valor: undefined // Asegurarse de que el valor esté indefinido inicialmente
      };
      
      if (campo.tipo === 'selector') {
        campo.opciones = attribute.values.map((value: any) => value.name);
        
        if (campo.identificador === "BRAND" && campo.opciones && !campo.opciones.includes("generico")) {
          campo.opciones.push("generico");
        }
      }
      
      this.camposGenerales.push(campo);
    });
  }


  removerAtributosObligatorios() {
    // Crear un conjunto con los IDs de los atributos requeridos para una búsqueda más eficiente
    const requiredIds = new Set(this.requiredAttributes.map(attr => attr.id));
  
    // Filtrar camposGenerales para mantener solo los campos que no están en requiredAttributes
    this.camposGenerales = this.camposGenerales.filter(campo => !requiredIds.has(campo.identificador));
  }




  //! Botones flotantes
  ClickAceptar() {
    this.compDetalleNuevo.recolectarDatos();
    
    //! Verificar que todos los campos no estén vacíos
    if (this.verificarCamposVacios()) {
      return;
    }
    
    // Crear un objeto para almacenar los campos generales
    let camposGeneralesObj: {[key: string]: any} = {};
      
    // Iterar sobre camposGenerales y añadir cada campo al objeto
    this.camposGenerales.forEach(campo => {
      camposGeneralesObj[campo.identificador] = campo.valor;
    });

    //! Dar formato a los datos
    let producto = {
      ...camposGeneralesObj, 
      dominioObj: this.dominioSeleccionado,
      fisica: {
        precio: this.camposFisica[0].valor,
        cantidad: this.camposFisica[1].valor,
      },
      online: {
        precio: this.camposOnline[0].valor,
        cantidad: this.camposOnline[1].valor,
      },
      fotos: this.fotos.map(foto => foto.filename),
      guiaTalle: this.guiaTalleSeleccionada ? this.guiaTalleSeleccionada.id : null,
    };
    
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
    const campoVacioGenerales = this.camposGenerales.find(campo => (campo.valor === "" || campo.valor === null || campo.valor === undefined) && campo.tipo !== 'readonly');
    if (campoVacioGenerales) {
      console.error(`El campo ${campoVacioGenerales.nombre} está vacío`);
      this.tituloModal = "Faltan campos por llenar";
      this.mensajeModal = `Por favor, llena el campo ${campoVacioGenerales.nombre} antes de continuar.`;
      this.openModal();
      return true;
    }
    
    const campoVacioFisica = this.camposFisica.find(campo => (campo.valor === "" || campo.valor === null || campo.valor === undefined) && campo.tipo !== 'readonly');
    if (campoVacioFisica) {
      console.error(`El campo ${campoVacioFisica.nombre} está vacío`);
      this.tituloModal = "Faltan campos por llenar";
      this.mensajeModal = `Por favor, llena el campo ${campoVacioFisica.nombre} antes de continuar.`;
      this.openModal();
      return true;
    }
    
    const campoVacioOnline = this.camposOnline.find(campo => (campo.valor === "" || campo.valor === null || campo.valor === undefined) && campo.tipo !== 'readonly');
    if (campoVacioOnline) {
      console.error(`El campo ${campoVacioOnline.nombre} está vacío`);
      this.tituloModal = "Faltan campos por llenar";
      this.mensajeModal = `Por favor, llena el campo ${campoVacioOnline.nombre} antes de continuar.`;
      this.openModal();
      return true;
    }
  
    return false;
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