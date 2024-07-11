import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiAuthService } from 'src/app/services/auth/api-auth.service';

@Component({
  selector: 'pag-usuario-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class PagUsuarioIniciarSesionComponent implements OnInit {


  alias: string = '';
  contra: string = '';
  errorMessage: string = '';
  
  constructor(
    private authService: ApiAuthService, 
    private router: Router,
  ) {}
  
  ngOnInit(): void {
  }

  onSubmit() {
    this.errorMessage = '';
    this.authService.login({ alias: this.alias, contraseña: this.contra }).subscribe(
      (response) => {
        console.log('Login successful', response);
        if (response && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
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

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }
}
