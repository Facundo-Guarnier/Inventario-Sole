import {
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Component
} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CompDetalleNuevoComponent } from 'src/app/componentes/comp-detalle-nuevo-prod/comp-detalle-nuevo-prod.component';
import { Campo } from 'src/app/interfaces/campo.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiMeliService } from 'src/app/services/meli/api-meli.service';
import { ApiProductoService } from 'src/app/services/productos/api-producto.service';
import { UltimasIDsService } from 'src/app/services/ultimaID/ultimas-ids.service';

// Interfaz para los valores de un atributo
interface Value {
  id: string;
  name: string;
}

// Interfaz para los atributos
interface Attribute {
  id: string;
  name: string;
  value_type: string;
  value_max_length?: number;
  tags: string[];
  values?: Value[];
  hierarchy: string;
  relevance: number;
  default_unit_id?: string;
  units?: Value[];
}

// Interfaz para la configuración de la UI
interface UIConfig {
  max_allowed?: number;
  allow_custom_value?: boolean;
  allow_filtering?: boolean;
  connector?: string;
  hint?: string;
}

// Interfaz para los componentes
interface Componente {
  component: string;
  label: string;
  ui_config: UIConfig;
  attributes?: Attribute[];
  components?: Componente[];
  unified_units?: Value[];
  default_unified_unit_id?: string;
}

// Interfaz para los grupos
interface Group {
  id: string;
  label: string;
  relevance: number;
  section: string;
  ui_config: UIConfig;
  components: Componente[];
}

// Interfaz para la entrada principal
interface TemplateGridTechnicalSpecs {
  groups: Group[];
}

interface Unidad {
  id: string;
  name: string;
}

interface Atributo {
  id: string;
  nombre: string;
  tipo: string;
  valor: string;
  unidad: string;
  unidades: Unidad[];
}

@Component({
  selector: 'pag-productos-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class PagProductosCrearComponent implements OnInit, AfterViewInit {
  //! Ver los componentes hijos
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild(CompDetalleNuevoComponent)
  compDetalleNuevo!: CompDetalleNuevoComponent;

  //! Para mostrar la opción de editar o no
  mostrarEditar: boolean = true;
  tituloGeneral: string = '';

  //! Botones flotantes
  mostrarAceptar = true;
  mostrarCancelar = true;

  //! Producto
  camposGenerales: Campo[] = [
    { nombre: 'ID', identificador: 'id', tipo: 'readonly' },
    {
      nombre: 'Titulo',
      identificador: 'titulo',
      tipo: 'input-text'
    },
    {
      nombre: 'Color',
      identificador: 'color',
      tipo: 'input-text'
    },
    {
      nombre: 'Talle',
      identificador: 'talle',
      tipo: 'input-text'
    },
    {
      nombre: 'Descripcion',
      identificador: 'descripcion',
      tipo: 'textarea-text'
    },
    {
      nombre: 'Genero',
      identificador: 'genero',
      tipo: 'selector',
      opciones: ['Hombre', 'Mujer', 'Niño', 'Niña', 'Unisex']
    },
    {
      nombre: 'Marca',
      identificador: 'marca',
      tipo: 'input-text'
    },
    {
      nombre: 'Liquidacion',
      identificador: 'liquidacion',
      tipo: 'boolean',
      valor: false
    }
  ];

  camposFisica: Campo[] = [
    { nombre: 'Precio', identificador: 'precio', tipo: 'input-number' },
    { nombre: 'Cantidad', identificador: 'cantidad', tipo: 'input-number' }
  ];

  //! Fotos
  fotos: { filename: string; url: SafeUrl }[] = [];
  id: string = '';

  //! Modal
  estaAbierto = false;
  tituloModal = 'titulo';
  mensajeModal = 'mensaje';
  redireccionar: boolean = false;

  //! Vista
  showNavbar = false;
  showSidebar = false;

  //* ------------------------------------------------------------

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiProductos: ApiProductoService,
    private ultimasIDs: UltimasIDsService,
    private apiMeli: ApiMeliService
  ) {}

  ngOnInit(): void {
    //! Buscar la id
    this.ultimasIDs
      .buscar_proxima_id('producto', this.authService.getToken())
      .subscribe(
        (id) => {
          this.id = id['proxima_id'];
          this.camposGenerales[0].valor = this.id;
        },
        (err) => {
          console.error('Error al buscar la última ID:', err);
        }
      );

    this.tituloGeneral = 'Crear producto';
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

    //! Verificar que todos los campos no estén vacíos
    if (this.verificarCamposVacios()) {
      return;
    }

    //! Crear un objeto para almacenar los campos generales
    let camposGeneralesObj: { [key: string]: any } = {};

    //! Iterar sobre camposGenerales y añadir cada campo al objeto
    this.camposGenerales.forEach((campo) => {
      camposGeneralesObj[campo.identificador] = campo.valor;
    });

    //! Dar formato a los datos
    let producto = {
      ...camposGeneralesObj,
      fisica: {
        precio: this.camposFisica[0].valor,
        cantidad: this.camposFisica[1].valor
      },
      fotos: this.fotos.map((foto) => foto.filename)
    };

    // //! Crear el producto
    this.apiProductos.crear(producto, this.authService.getToken()).subscribe(
      (res: any) => {
        this.tituloModal = 'Producto creado';
        this.mensajeModal = 'El producto se ha creado correctamente.';
        this.redireccionar = true;
        this.openModal();
      },
      (err: any) => {
        console.error('Error al crear el producto:', err);
        this.tituloModal = 'Error al crear';
        this.mensajeModal =
          'Ha ocurrido un error al crear el producto. Error: ' +
          err['error']['msg'];
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
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
  onFotosActualizadas(fotos: { filename: string; url: SafeUrl }[]) {
    this.fotos = fotos;
  }
  archivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    if (file) {
      // TODO: Agregar aquí la lógica para subir la imagen
    }
  }

  //! Recolectar datos de los componentes hijos
  onDatosRecolectados(camposGenerales: any[]) {
    this.camposGenerales = camposGenerales[0];
    this.camposFisica = camposGenerales[1];
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
    const campoVacioGenerales = this.camposGenerales.find(
      (campo) =>
        (campo.valor === '' ||
          campo.valor === null ||
          campo.valor === undefined) &&
        campo.tipo !== 'readonly'
    );
    if (campoVacioGenerales) {
      this.tituloModal = 'Faltan campos por llenar';
      this.mensajeModal = `Por favor, llena el campo ${campoVacioGenerales.nombre} antes de continuar.`;
      this.openModal();
      return true;
    }

    const campoVacioFisica = this.camposFisica.find(
      (campo) =>
        (campo.valor === '' ||
          campo.valor === null ||
          campo.valor === undefined) &&
        campo.tipo !== 'readonly'
    );
    if (campoVacioFisica) {
      this.tituloModal = 'Faltan campos por llenar';
      this.mensajeModal = `Por favor, llena el campo ${campoVacioFisica.nombre} antes de continuar.`;
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
