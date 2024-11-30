import { Component, OnInit, ViewChild } from '@angular/core';
import { CompDetalleNuevoGenericoComponent } from 'src/app/componentes/comp-detalle-nuevo-generico/comp-detalle-nuevo-generico.component';
import { CompVentaListaProdComponent } from 'src/app/componentes/comp-venta-lista-prod/comp-venta-lista-prod.component';
import { Campo } from 'src/app/interfaces/campo.interface';
import { ApiVentasService } from 'src/app/services/ventas/api-venta.service';
import { UltimasIDsService } from 'src/app/services/ultimaID/ultimas-ids.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { ApiProductoService } from 'src/app/services/productos/api-producto.service';

@Component({
  selector: 'pag-ventas-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class PagVentasCrearComponent implements OnInit {
  //! Ver los componentes hijos
  @ViewChild(CompVentaListaProdComponent)
  compVentaLista!: CompVentaListaProdComponent;
  @ViewChild(CompDetalleNuevoGenericoComponent)
  compDetalleNuevo!: CompDetalleNuevoGenericoComponent;

  //! Campos para el detalle de la venta
  titulo1 = 'Detalle de la venta';
  id = '';
  campos1: Campo[] = [
    { nombre: 'ID Venta', identificador: 'idVenta', tipo: 'readonly' },
    { nombre: 'Cliente', identificador: 'cliente', tipo: 'input-text' },
    {
      nombre: 'Tienda',
      identificador: 'tienda',
      tipo: 'selector-actualizar',
      opciones: ['Fisica', 'Online']
    },
    { nombre: 'Monto total', identificador: 'total', tipo: 'input-number' },
    { nombre: 'Método', identificador: 'metodo', tipo: 'textarea-text' },
    {
      nombre: 'Comentario',
      identificador: 'comentario',
      tipo: 'textarea-text'
    }
  ];
  detalleventa = {};

  //! Campos para los productos de la venta
  titulo2 = 'Productos';
  campos2: Campo[] = [
    {
      nombre: 'ID producto',
      identificador: 'idProducto',
      tipo: 'input-actualizar'
    },
    { nombre: 'Cantidad', identificador: 'cantidad', tipo: 'input-number' },
    {
      nombre: 'Precio unitario de venta',
      identificador: 'precio',
      tipo: 'input-number'
    },
    {
      nombre: 'Precio unitario original',
      identificador: 'precio_original',
      tipo: 'readonly'
    },
    {
      nombre: 'Comentario',
      identificador: 'comentario',
      tipo: 'textarea-text'
    }
  ];
  productos: any[] = [];

  //! Modal
  estaAbierto = false;
  tituloModal = 'titulo';
  mensajeModal = 'mensaje';
  redireccionar: boolean = false;

  //! Vista
  showNavbar = false;
  showSidebar = false;

  //! Actualizar en vivo el precio del producto
  tiendaSeleccionada: string = '';

  //* ------------------------------------------------------------

  constructor(
    private apiVenta: ApiVentasService,
    private authService: AuthService,
    private ultimasIDs: UltimasIDsService,
    private router: Router,
    private apiProductos: ApiProductoService
  ) {}

  ngOnInit(): void {
    //! Buscar id
    this.ultimasIDs
      .buscar_proxima_id('venta', this.authService.getToken())
      .subscribe(
        (id) => {
          this.id = id;
          this.campos1[0].valor = this.id;
        },
        (err) => {
          console.error('Error al buscar la última ID:', err);
        }
      );
  }

  //T* Funciones
  //! Boton flotante
  clickAceptar() {
    //! Obtener los datos de los componentes hijos
    this.compDetalleNuevo.recolectarDatos();
    this.compVentaLista.recolectarDatos();

    //! Revisar si hay campos vacíos
    let optionalFields = ['comentario'];
    let venta_nueva = {
      total: 100, //TODO: calcular el total
      ...this.detalleventa,
      productos: this.productos
    };

    if (
      this.hasEmptyFields(venta_nueva, optionalFields) ||
      this.productos.length === 0
    ) {
      this.tituloModal = 'Error al crear la venta';
      this.mensajeModal =
        'No se pudo crear la venta. Revise los campos e intente de nuevo.';
      this.openModal();
      console.error('Hay campos vacíos.');
      return;
    }

    //! Crear la venta
    this.apiVenta.crear(venta_nueva, this.authService.getToken()).subscribe(
      (res) => {
        console.log('Venta creada:', res);
        this.tituloModal = 'Venta creada';
        this.mensajeModal = 'La venta ha sido creado correctamente.';
        this.redireccionar = true;
        this.openModal();
      },
      (err) => {
        console.error('Error al crear la venta:', err);
        this.tituloModal = 'Error al crear la venta';
        this.mensajeModal =
          'No se pudo crear la venta. Error: ' + err['error']['msg'];
        this.openModal();
      }
    );
  }
  clickCancelar() {
    this.router.navigate(['/ven']);
  }

  //! Recolectar datos de los componentes hijos
  onDatosRecolectadosVenta(datos: {}) {
    this.detalleventa = datos;
  }
  onDatosRecolectadosProductos(datos: any[]) {
    this.productos = datos;
  }

  //! Revisar si hay campos vacíos
  isEmpty(value: any): boolean {
    return (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    );
  }
  hasEmptyFields(obj: any, optionalFields: string[] = []): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        //! Campo "Comentario" es opcional
        if (key === 'comentario' && optionalFields.includes(key)) {
          continue;
        }

        //! Campo "tienda" no debe tener el valor "Seleccionar..."
        if (key === 'tienda' && value === 'Seleccionar...') {
          return true;
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
          if (this.hasEmptyFields(value, optionalFields)) {
            return true;
          }
        } else if (Array.isArray(value)) {
          for (const item of value) {
            if (typeof item === 'object') {
              if (this.hasEmptyFields(item, optionalFields)) {
                return true;
              }
            } else if (this.isEmpty(item)) {
              return true;
            }
          }
        } else if (this.isEmpty(value)) {
          return true;
        }
      }
    }
    return false;
  }

  //! Modal
  openModal() {
    this.estaAbierto = true;
  }
  cerrarModal() {
    this.estaAbierto = false;
    if (this.redireccionar) {
      this.router.navigate(['/ven']);
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

  //! Actualizar campos
  async onSelectorChange(event: any) {
    if (event.identificador === 'tienda') {
      this.tiendaSeleccionada = event.valor.toLowerCase();
      await this.actualizarTodosLosPrecios();
    }
  }

  async actualizarTodosLosPrecios() {
    const productos = this.compVentaLista.obtenerProductos();
    const productosNoDisponibles: string[] = [];

    const promesas = productos.map((producto) => {
      if (producto.idProducto) {
        return this.buscarPrecioProducto(
          producto.idProducto,
          productosNoDisponibles
        );
      }
      return Promise.resolve();
    });

    await Promise.all(promesas);

    if (productosNoDisponibles.length > 0) {
      this.tituloModal = 'Productos no disponibles';
      this.mensajeModal = `Los siguientes productos no están disponibles en la tienda seleccionada: ${productosNoDisponibles.join(', ')}`;
      this.openModal();
    }
    productosNoDisponibles.forEach((producto) => {
      this.compVentaLista.quitarProducto(
        this.compVentaLista.productos.findIndex(
          (p) => p.idProducto === producto
        )
      );
    });
  }

  buscarPrecioProducto(
    idProducto: string,
    productosNoDisponibles?: string[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (
        !this.tiendaSeleccionada ||
        this.tiendaSeleccionada === 'Seleccionar...'
      ) {
        if (!productosNoDisponibles) {
          this.tituloModal = 'Error al buscar el producto';
          this.mensajeModal =
            'Seleccione una tienda antes de buscar el producto.';
          this.openModal();
        }
        resolve();
        return;
      }

      this.apiProductos.buscar_x_atributo({ id: idProducto }, 1, 20).subscribe(
        (response) => {
          const producto = response['msg'][0];
          if (!producto) {
            console.error('Producto no encontrado:', idProducto);
            if (!productosNoDisponibles) {
              this.tituloModal = 'Error al buscar el producto';
              this.mensajeModal = 'Producto no encontrado.';
              this.openModal();
            }
            resolve();
            return;
          }

          if (producto[this.tiendaSeleccionada]['cantidad'] <= 0) {
            if (productosNoDisponibles) {
              productosNoDisponibles.push(producto.nombre || idProducto);
            } else {
              this.tituloModal = 'Error al buscar el producto';
              this.mensajeModal =
                'Producto no disponible en la tienda seleccionada.';
              this.openModal();
            }
            resolve();
            return;
          }
          this.compVentaLista.actualizarPrecioProducto(
            idProducto,
            producto[this.tiendaSeleccionada]['precio']
          );
          resolve();
        },
        (error) => {
          console.error('Error al buscar el producto:', error);
          reject(error);
        }
      );
    });
  }
}
