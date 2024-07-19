import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUsuariosService } from '../../../services/usuarios/api-usuario.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Filtro } from 'src/app/interfaces/filtro.interface';


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
    detalle: false,
  }
  columnas = [
    { nombre: 'Alias', identificador: "alias", tipo: 'text' },
    { nombre: 'Roles', identificador: "roles", tipo: 'text' },
  ];
  datos: any[] = [];
  
  //! Paginamiento 
  paginaActual = 1;
  porPagina = 10;
  totalDatos = 17;
  totalPaginas =  Math.ceil(this.totalDatos/this.porPagina);
  
  //* ------------------------------------------------------------
  
  constructor(
    private router: Router,
    private apiUsuarios: ApiUsuariosService,
    private authService: AuthService,
  ) { }
  
  ngOnInit(): void {
    this.apiUsuarios.buscar_todos(this.authService.getToken(), this.paginaActual, this.porPagina).subscribe({
      next: (data) => {
        this.datos = Object.values(data).flat();
      },
      error: (error) => {
        console.error('ERROR al cargar usuarios:', error);
      }
    });
  }
  
  //T* Funcniones
  //! Botones flotantes
  ClickAgregar(){
    this.router.navigate(['usu/crear']);
  };
}
