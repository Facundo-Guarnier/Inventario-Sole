import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUsuariosService } from '../../../services/usuarios/api-usuario.service';

@Component({
  selector: 'pag-usuario-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrls: ['./vista-general.component.css']
})
export class PagUsuarioVistaGeneralComponent implements OnInit {

  //! NavBar
  pagActual = 'usu';
  
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
  
  datos: any[] = [
    
  ];
  
  constructor(
    private router: Router,
    private apiUsuarios: ApiUsuariosService,
  ) { }
  
  ngOnInit(): void {

    this.apiUsuarios.buscar_x_atributo({}).subscribe({
      next: (data) => {
        this.datos = Object.values(data).flat();
      },
      error: (error) => {
        console.error('ERROR al cargar usuarios:', error);
      }
    });

  }
  
  //! Botones flotantes
  ClickAgregar(){
    this.router.navigate(['usu/crear']);
  };
  
}
