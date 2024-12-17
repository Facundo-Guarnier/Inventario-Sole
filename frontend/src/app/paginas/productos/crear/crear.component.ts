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
import { Dominio } from 'src/app/interfaces/dominio.interface';
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

// interface Attribute {
//   id: string;
//   name: string;
//   values?: { name: string }[];
// }

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
      nombre: 'Código Mercado Shop',
      identificador: 'cod_ms',
      tipo: 'readonly'
    },
    {
      nombre: 'Titulo (sin talle, color o descuento)',
      identificador: 'titulo',
      tipo: 'input-text'
    },
    // { nombre: "Descripcion", identificador: "descripcion", tipo: "textarea-text"},
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

  camposOnline: Campo[] = [
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

  //! Variables según el dominio
  dominios: Dominio[] = [
    // {domain_id: 'MLA-T_SHIRTS', domain_name: 'Remeras', category_id: 'MLA414238', category_name: 'Remeras, Musculosas y Chombas'},
  ];
  dominioSeleccionado: Dominio = {};
  requiredAttributes: Attribute[] = [];

  //T* ------------------------------------------------------------
  //! Guias de talles
  guiasTalles: any[] = [];
  guiaTalleSeleccionada: any = null;
  mostrarModalCrearGuiaTalle = false;

  defaultNuevaGuiaTalle = {
    nombre: '',
    atributos: [
      {
        id: '',
        nombre: 'Talle',
        tipo: 'text',
        unidades: [] as Unidad[],
        valor: '',
        unidad: { id: '', name: '' } as Unidad
      }
    ],
    talles: [{ nombre: '', valores: [''] }]
  };
  nuevaGuiaTalle = { ...this.defaultNuevaGuiaTalle };

  guiaTallesTemplate: any = null;
  //T* ------------------------------------------------------------

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

  //* > REFACTORIZAR TODO ESTO, NO SE ENTIENDE UN CHOTO
  //* > DIVIDIR BIEN TODAS LAS FUNCIONES ASÍ PUEDO VER PORQUE FALLA LA BUSQUEDA DEL TEMPLATE DE GUIA DE TALLES
  //* > VER LAS INTERFACES CREADAS SI ESTÄN BIEN O SI SON NECESARIAS

  //! Guia de talles
  // Paso 1: Ingresar titulo
  // Paso 2: Buscar posibles dominios
  // Paso 3: Seleccionar un dominio
  // Paso 4: Obtener ficha técnica del dominio (/domains/{domain_id}/technical_specs)
  // Paso 5: Obtener los atributos obligatorios (de la ficha técnica) (/categories/{category_id}/attributes)
  // Paso 6: Consultar la ficha técnica de la guía de talles (/domains/{domain_id}/technical_specs?section=grids + campos obligatorios + genero)
  // Paso 7: Crear la guía de talles (/catalog/charts)

  //T* Paso 1: Ingresar titulo
  //! Implementada en el evento onChange

  //T* Paso 2: Buscar posibles dominios
  //! Buscar el dominio del producto en base al titulo y agrega el path completo al dominio (Remera, Musculosa, Chomba > Remera > ...)
  //? ESTA FUNCION ESTÁ BIEN, NO TOCAR
  buscarDominiosXTitulo(titulo: string) {
    this.guiasTalles = [];
    this.guiaTalleSeleccionada = null; //! Reset la selección

    this.apiMeli
      .get(
        '/sites/MLA/domain_discovery/search?q=' + titulo,
        this.authService.getToken()
      )
      .subscribe(
        (res: any) => {
          //? ESTA FUNCION ESTÁ BIEN, NO TOCAR
          //! Agregar path completo
          this.dominios = res.map((dominio: Dominio) => {
            this.apiMeli
              .get(
                '/categories/' + dominio['category_id'],
                this.authService.getToken()
              )
              .subscribe(
                (res: any) => {
                  dominio.path_completo = res.path_from_root
                    .map((path: any) => path.name)
                    .join(' > ');
                  let dominios_nombre: string[] = this.dominios.map(
                    (dominio: any) => dominio.path_completo
                  );

                  //! Verificar si existe el campo dominio
                  let campoDominioIndex = this.camposGenerales.findIndex(
                    (campo) => campo.identificador === 'dominio'
                  );
                  if (campoDominioIndex !== -1) {
                    //! Borrar el campo existente
                    this.camposGenerales.splice(campoDominioIndex, 1);
                  }
                  //! Crear un nuevo campo "dominio"
                  this.camposGenerales.push({
                    nombre: 'Dominio',
                    identificador: 'dominio',
                    tipo: 'selector',
                    opciones: dominios_nombre
                  });
                  this.removerAtributosObligatorios();
                },
                //? ESTA FUNCION ESTÁ BIEN, NO TOCAR
                (err: any) => {
                  console.error('Error al buscar en Meli:', err);
                }
              );
            return dominio;
          });
          //? ESTA FUNCION ESTÁ BIEN, NO TOCAR
        },

        (err: any) => {
          console.error('Error al buscar en Meli:', err);
        }
      );
  }

  //T* Paso 3: Seleccionar un dominio
  //? ESTA FUNCION ESTÁ BIEN, NO TOCAR
  seleccionarDominio(path_completo: string) {
    this.dominioSeleccionado =
      this.dominios.find(
        (dominio: Dominio) => dominio.path_completo === path_completo
      ) || {};
    this.buscarAtributosObligatorios();
    this.buscarGuiasTallesCreadas();
  }

  //T* Paso 4: Obtener ficha técnica del dominio
  //? Es necesario este paso? el paso 5 obtiene los atributos obligatorios de otra forma
  // obtenerFichaTecnicaDominio() {
  //   const d_id = this.dominioSeleccionado["domain_id"] || "MLA-T_SHIRTS";
  //   const domainId = d_id.slice(4); //! Está en formato MLA-T_SHIRTS y necesita `T_SHIRTS`
  //   this.apiMeli.get(`/domains/${domainId}/technical_specs`, this.authService.getToken())
  //     .subscribe(
  //       (technicalSpecsResponse: any) => {
  //         console.log("Ficha Técnica del Dominio:", technicalSpecsResponse);
  //         this.procesarFichaTecnica(technicalSpecsResponse);
  //       },
  //       (err: any) => {
  //         console.error('Error al obtener la ficha técnica del dominio:', err);
  //       }
  //     );
  // }

  //T* Paso 5: Obtener los atributos obligatorios
  //! Buscar los atributos obligatorios del dominio seleccionado
  //? ESTA FUNCION ESTÁ BIEN, NO TOCAR
  buscarAtributosObligatorios() {
    this.apiMeli
      .get(
        '/categories/' +
          this.dominioSeleccionado['category_id'] +
          '/attributes',
        this.authService.getToken()
      )
      .subscribe(
        (res: any) => {
          //? ESTA FUNCION ESTÁ BIEN, NO TOCAR
          this.removerAtributosObligatorios();
          this.requiredAttributes = res.filter(
            (attribute: any) =>
              attribute.tags && attribute.tags.required === true
          );
          this.agregarAtributosObligatorios();
          //? ESTA FUNCION ESTÁ BIEN, NO TOCAR

          //TODO Agregar en el backend los atributos obligatorios para guardarlos en la db
        },
        (err: any) => {
          console.error('Error al buscar en Meli:', err);
        }
      );
  }

  //! Agregar los nuevos atributos obligatorios
  //? ESTA FUNCION ESTÁ BIEN, NO TOCAR
  agregarAtributosObligatorios() {
    this.requiredAttributes.forEach((attribute: any) => {
      const campo: Campo = {
        nombre: attribute.name,
        identificador: attribute.id,
        tipo:
          attribute.values && attribute.values.length > 0
            ? 'selector'
            : 'input-text',
        valor: undefined
      };

      if (campo.tipo === 'selector') {
        campo.opciones = attribute.values.map((value: any) => value.name);

        if (
          campo.identificador === 'BRAND' &&
          campo.opciones &&
          !campo.opciones.includes('generico')
        ) {
          campo.opciones.push('generico');
        }
      }

      this.camposGenerales.push(campo);
    });
  }

  //? ESTA FUNCION ESTÁ BIEN, NO TOCAR
  removerAtributosObligatorios() {
    const requiredIds = new Set(this.requiredAttributes.map((attr) => attr.id));
    this.camposGenerales = this.camposGenerales.filter(
      (campo) => !requiredIds.has(campo.identificador)
    );
  }

  //T* Paso 6: Consultar la ficha técnica de la guía de talles
  //? HAY 2 FUNCIONES QUE QUIEREN HACER LO MISMO, VER CUAL ES LA QUE SE DEBE USAR
  obtenerFichaTecnicaGuiaTalles(requiredAttributes: string[]) {
    const d_id = this.dominioSeleccionado['domain_id'] || 'MLA-T_SHIRTS';
    const domainId = d_id.slice(4);
    const gridTechnicalSpecsPayload = {
      attributes: requiredAttributes.map((id) => ({
        id: id,
        value_name: 'Mujer' //TODO: Este valor debería ajustarse según los atributos reales requeridos
      }))
    };

    this.apiMeli
      .post(
        `/domains/${domainId}/technical_specs?section=grids`,
        JSON.stringify(gridTechnicalSpecsPayload),
        this.authService.getToken()
      )
      .subscribe(
        (gridTechnicalSpecsResponse: any) => {
          console.log(
            'Ficha Técnica de la Guía de Talles:',
            gridTechnicalSpecsResponse
          );
          this.guiaTallesTemplate = gridTechnicalSpecsResponse;
        },
        (err: any) => {
          console.error(
            'Error al obtener la ficha técnica de la guía de talles:',
            err
          );
        }
      );
  }

  obtenerPlantillaGuiaTalles() {
    const attributes = this.requiredAttributes.map((attribute) => ({
      id: attribute.id,
      value_name:
        attribute.values && attribute.values.length > 0
          ? attribute.values[0].name
          : ''
    }));

    const payload = {
      attributes
    };

    let d_id = this.dominioSeleccionado['domain_id'] || 'MLA-T_SHIRTS';
    console.log('Dominio seleccionado:', d_id);
    this.apiMeli
      .post(
        `/domains/${d_id}/technical_specs?section=grids`,
        JSON.stringify(payload),
        this.authService.getToken()
      )
      .subscribe(
        (res: any) => {
          this.guiaTallesTemplate = res;
          console.log('Plantilla de guía de talles:', this.guiaTallesTemplate);
        },
        (err: any) => {
          console.error(
            'Error al obtener la plantilla de guía de talles:',
            err
          );
        }
      );
  }

  //T* Paso 7: Crear la guía de talles
  crearGuiaTalle() {
    const domainId = this.dominioSeleccionado.domain_id || 'MLA-T_SHIRTS';

    const createChartPayload = {
      names: { MLA: this.nuevaGuiaTalle.nombre },
      domain_id: domainId.slice(4),
      site_id: 'MLA',
      main_attribute: {
        attributes: [
          {
            site_id: 'MLA',
            id: 'SIZE'
          }
        ]
      },
      attributes: this.nuevaGuiaTalle.atributos.map((atributo) => ({
        id: atributo.id,
        values: [{ name: atributo.valor }]
      })),
      rows: this.nuevaGuiaTalle.talles.map((talle) => ({
        attributes: [
          {
            id: 'SIZE',
            values: [{ name: talle.nombre }]
          },
          ...talle.valores.map((valor, index) => ({
            id: this.nuevaGuiaTalle.atributos[index].id,
            values: [{ name: valor }]
          }))
        ]
      }))
    };

    this.apiMeli
      .post(
        '/catalog/charts',
        JSON.stringify(createChartPayload),
        this.authService.getToken()
      )
      .subscribe(
        (res: any) => {
          console.log('Guía de Talles Creada:', res);
          this.guiasTalles.push(res);
          this.cerrarModalCrearGuiaTalle();
        },
        (err: any) => {
          console.error('Error al crear la guía de talle:', err);
        }
      );
  }

  //T* Otros
  //! Buscar las guías de talles creadas por el usuario
  buscarGuiasTallesCreadas() {
    if (this.dominioSeleccionado['domain_id'] === undefined) {
      return;
    }

    if (this.dominioSeleccionado['domain_id']) {
      this.obtenerPlantillaGuiaTalles();
    }

    //! Buscar las guías de talles
    let search_charts_payload: {} = {
      domain_id: this.dominioSeleccionado['domain_id'].slice(4),
      site_id: 'MLA',
      seller_id: '327259941', //TODO: Cambiar por la ID de la cuenta de la sole
      attributes: [
        {
          id: 'GENDER',
          values: [
            {
              name: 'Mujer'
            }
          ]
        },
        {
          id: 'BRAND',
          values: [
            {
              name: 'generico'
            }
          ]
        }
      ]
    };
    this.apiMeli
      .post(
        '/catalog/charts/search',
        JSON.stringify(search_charts_payload),
        this.authService.getToken()
      )
      .subscribe(
        (res: any) => {
          this.guiasTalles = res.charts || [];
          console.log('Guias de talles:', this.guiasTalles);
          this.guiaTalleSeleccionada = null; // Reset la selección
        },
        (err: any) => {
          console.error('Error al buscar en Meli:', err);
        }
      );
  }

  //T* Modales
  abrirModalCrearGuiaTalle() {
    // Asegúrate de que tienes la plantilla antes de abrir el modal
    if (!this.guiaTallesTemplate) {
      console.error('No se ha cargado la plantilla de guía de talles.');
      return;
    }
    this.mostrarModalCrearGuiaTalle = true;
  }

  cerrarModalCrearGuiaTalle() {
    this.mostrarModalCrearGuiaTalle = false;
    this.resetNuevaGuiaTalle();
  }

  agregarAtributo() {
    this.nuevaGuiaTalle.atributos.push(this.defaultNuevaGuiaTalle.atributos[0]);
    this.nuevaGuiaTalle.talles.forEach((talle) => talle.valores.push(''));
  }

  eliminarAtributo(index: number) {
    this.nuevaGuiaTalle.atributos.splice(index, 1);
    this.nuevaGuiaTalle.talles.forEach((talle) =>
      talle.valores.splice(index, 1)
    );
  }

  agregarTalle() {
    this.nuevaGuiaTalle.talles.push({
      nombre: '',
      valores: new Array(this.nuevaGuiaTalle.atributos.length).fill('')
    });
  }

  eliminarTalle(index: number) {
    this.nuevaGuiaTalle.talles.splice(index, 1);
  }

  procesarFichaTecnica(technicalSpecsResponse: any) {
    const requiredAttributes: string[] = [];

    technicalSpecsResponse.input.groups.forEach((group: any) => {
      group.components.forEach((component: any) => {
        if (component.attributes) {
          component.attributes.forEach((attribute: any) => {
            if (
              attribute.tags &&
              attribute.tags.includes('grid_template_required')
            ) {
              requiredAttributes.push(attribute.id);
            }
          });
        }
      });
    });

    this.obtenerFichaTecnicaGuiaTalles(requiredAttributes);
  }

  seleccionarGuiaTalle(guia: any) {
    this.guiaTalleSeleccionada = guia;
  }

  resetNuevaGuiaTalle() {
    this.nuevaGuiaTalle = { ...this.defaultNuevaGuiaTalle };
  }

  //T* ------------------------------------------------------------
  //! Actualizar campos/inputs
  async onChange(event: { identificador: string; valor: string }) {
    // console.log('Evento:', event);

    if (event.identificador === 'titulo') {
      this.buscarDominiosXTitulo(event.valor);
    }

    if (event.identificador === 'dominio') {
      this.seleccionarDominio(event.valor);
    }
  }

  //! Botones flotantes
  ClickAceptar() {
    this.compDetalleNuevo.recolectarDatos();

    //! Verificar que todos los campos no estén vacíos
    if (this.verificarCamposVacios()) {
      return;
    }

    // Crear un objeto para almacenar los campos generales
    let camposGeneralesObj: { [key: string]: any } = {};

    // Iterar sobre camposGenerales y añadir cada campo al objeto
    this.camposGenerales.forEach((campo) => {
      camposGeneralesObj[campo.identificador] = campo.valor;
    });

    //! Dar formato a los datos
    let producto = {
      ...camposGeneralesObj,
      dominioObj: this.dominioSeleccionado,
      fisica: {
        precio: this.camposFisica[0].valor,
        cantidad: this.camposFisica[1].valor
      },
      online: {
        precio: this.camposOnline[0].valor,
        cantidad: this.camposOnline[1].valor
      },
      fotos: this.fotos.map((foto) => foto.filename),
      guiaTalle: this.guiaTalleSeleccionada
        ? this.guiaTalleSeleccionada.id
        : null
    };

    //! Crear el producto
    this.apiProductos.crear(producto, this.authService.getToken()).subscribe(
      (res: any) => {
        console.log('Producto creado:', res);
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
    const campoVacioGenerales = this.camposGenerales.find(
      (campo) =>
        (campo.valor === '' ||
          campo.valor === null ||
          campo.valor === undefined) &&
        campo.tipo !== 'readonly'
    );
    if (campoVacioGenerales) {
      console.error(`El campo ${campoVacioGenerales.nombre} está vacío`);
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
      console.error(`El campo ${campoVacioFisica.nombre} está vacío`);
      this.tituloModal = 'Faltan campos por llenar';
      this.mensajeModal = `Por favor, llena el campo ${campoVacioFisica.nombre} antes de continuar.`;
      this.openModal();
      return true;
    }

    const campoVacioOnline = this.camposOnline.find(
      (campo) =>
        (campo.valor === '' ||
          campo.valor === null ||
          campo.valor === undefined) &&
        campo.tipo !== 'readonly'
    );
    if (campoVacioOnline) {
      console.error(`El campo ${campoVacioOnline.nombre} está vacío`);
      this.tituloModal = 'Faltan campos por llenar';
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
