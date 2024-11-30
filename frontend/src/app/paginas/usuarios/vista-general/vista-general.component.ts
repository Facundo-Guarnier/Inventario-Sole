import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUsuariosService } from '../../../services/usuarios/api-usuario.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Filtro } from 'src/app/interfaces/filtro.interface';
import { ApiBackupService } from 'src/app/services/backup/api-backup.service';

@Component({
  selector: 'pag-usuario-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})
export class PagUsuarioVistaGeneralComponent implements OnInit {
  //! Tabla de datos
  acciones = {
    editar: true,
    eliminar: false,
    detalle: false
  };
  columnas = [
    { nombre: 'Alias', identificador: 'alias', tipo: 'text' },
    { nombre: 'Roles', identificador: 'roles', tipo: 'text' }
  ];
  datos: any[] = [];

  //! Paginamiento
  paginaActual = 1;
  porPagina = 20;
  totalDatos = 0;
  totalPaginas = 0;

  //! Vista
  showNavbar = false;
  showSidebar = false;

  //! Modal
  estaAbierto = false;
  tituloModal = 'titulo';
  mensajeModal = 'mensaje';
  redireccionar: boolean = false;

  //! DB
  selectedFile: File | null = null;

  //! Mostrar la pagina actual
  pagActual: string = '';

  //* ------------------------------------------------------------

  constructor(
    private router: Router,
    private apiUsuarios: ApiUsuariosService,
    private authService: AuthService,
    private apiBackup: ApiBackupService
  ) {}

  ngOnInit(): void {
    this.recargarLista();
    this.pagActual = this.router.url.split('/')[1].split('?')[0];
  }

  //T* Funciones
  recargarLista() {
    this.apiUsuarios
      .buscar_todos(
        this.authService.getToken(),
        this.paginaActual,
        this.porPagina
      )
      .subscribe({
        next: (data) => {
          this.datos = Object.values(data['usuarios']).flat();
          this.totalDatos = Math.max(1, data['total']);
          this.totalPaginas = Math.ceil(this.totalDatos / this.porPagina);
        },
        error: (error) => {
          console.error('ERROR al cargar usuarios:', error);
        }
      });
  }

  //! Botones flotantes
  ClickAgregar() {
    this.router.navigate(['usu/crear']);
  }

  //! Paginamiento
  clickPagina(numero: number) {
    this.paginaActual = numero;
    this.recargarLista();
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

  //! Descargar base de datos
  downloadDatabase() {
    this.apiBackup.downloadDB().subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/bin' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        //! Archivo
        const fecha = new Date();
        const fechaFormateada = fecha
          .toISOString()
          .replace(/T/, '_')
          .replace(/\..+/, '')
          .replace(/:/g, '-');
        link.download = `BaseDatos-Backup_${fechaFormateada}.bin`;

        link.click();
        window.URL.revokeObjectURL(url);

        //! Modal
        this.tituloModal = 'Base de datos descargada';
        this.mensajeModal =
          'La base de datos ha sido descargada correctamente.';
        this.redireccionar = false;
        this.openModal();
      },
      (error) => {
        this.tituloModal = 'Error al descargar la base de datos';
        this.mensajeModal =
          'No se pudo descargar la base de datos. Error: ' + error['message'];
        this.redireccionar = false;
        this.openModal();
      }
    );
  }

  //! Subir base de datos
  uploadDatabase() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.apiBackup.uploadDB(formData).subscribe(
        (response) => {
          console.log('Base de datos subida con éxito', response);
          this.tituloModal = 'Base de datos subida';
          this.mensajeModal = 'La base de datos ha sido subida correctamente.';
          this.redireccionar = false;
          this.openModal();
        },
        (error) => {
          console.error('Error al subir la base de datos', error);
          this.tituloModal = 'Error al subir la base de datos';
          this.mensajeModal =
            'No se pudo subir la base de datos. Error: ' + error['message'];
          this.redireccionar = false;
          this.openModal();
        }
      );
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0] as File;
    if (file && file.name.endsWith('.bin')) {
      this.selectedFile = file;
    } else {
      this.tituloModal = 'Error al subir la base de datos';
      this.mensajeModal = 'Por favor, seleccione un archivo .bin';
      this.redireccionar = false;
      this.openModal();
      this.selectedFile = null;
    }
  }

  //! Modal
  openModal() {
    this.estaAbierto = true;
  }
  cerrarModal() {
    this.estaAbierto = false;
    if (this.redireccionar) {
      this.router.navigate(['/usu']);
    }
  }

  //! Mostrar la pagina actual
  getPaginaActual(): string {
    switch (this.pagActual) {
      case 'ven':
        return 'Ventas';
      case 'dev':
        return 'Devoluciones';
      case 'mov':
        return 'Movimientos';
      case 'tf':
        return 'Tienda Física';
      case 'to':
        return 'Tienda Online';
      case 'usu':
        return 'Usuarios';
      default:
        return 'Página Actual';
    }
  }
}
