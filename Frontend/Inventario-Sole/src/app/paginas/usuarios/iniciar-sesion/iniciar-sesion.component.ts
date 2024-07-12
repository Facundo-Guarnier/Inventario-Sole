import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'pag-usuario-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})

export class PagUsuarioIniciarSesionComponent implements OnInit {
  
  //! Datos
  alias: string = '';
  contra: string = '';
  errorMessage: string = '';
  
  //* ------------------------------------------------------------
  
  constructor(
    private authService: AuthService, 
    private router: Router,
  ) {}
  
  ngOnInit(): void {
  }
  
  //T* Funciones
  //! Boton login
  ingresar() {
    this.errorMessage = '';
    this.authService.login({ alias: this.alias, contraseña: this.contra }).subscribe(
      (response) => {
        if (response && response.access_token) {
          localStorage.setItem('token', response.access_token);
          this.router.navigate(['/ven']);
          
        } else {
          this.errorMessage = 'Respuesta de login inválida';
        }
      },
      (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    );
  }
}
