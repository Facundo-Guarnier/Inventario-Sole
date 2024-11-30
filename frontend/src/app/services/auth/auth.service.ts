import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, take, BehaviorSubject, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = '/api/auth';

  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();
  private tokenKey = 'token';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public jwtHelper: JwtHelperService
  ) {
    this.checkToken();
  }

  login(dataLogin: any): Observable<any> {
    /*
    Se realiza la petición POST al servidor con los datos de login.
    */
    console.log('LA URL PARA EL BACKEND:', this.url + '/acceder');
    return this.httpClient.post(this.url + '/acceder', dataLogin).pipe(
      take(1),
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.checkToken();
        }
      })
    );
  }

  register(dataRegister: {}): Observable<any> {
    return this.httpClient
      .post(this.url + '/registrar', dataRegister)
      .pipe(take(1));
  }

  logout() {
    /*
    Se elimina el token del localStorage y se redirige al usuario a la página de login.
    */
    localStorage.removeItem('token');
    this.userRoleSubject.next(null);
    this.router.navigate(['login']);
  }

  isLoggedIn(): boolean {
    /*
    Se comprueba si el token existe y si no ha expirado.
    */
    return (
      !!localStorage.getItem('token') &&
      !this.jwtHelper.isTokenExpired(localStorage.getItem('token'))
    );
  }

  checkToken() {
    /*
    TODO
    */
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.userRoleSubject.next(decodedToken.role);
    } else {
      this.userRoleSubject.next(null);
    }
  }

  isAdmin(): boolean {
    /* 
    Se comprueba si el usuario tiene el rol de Admin.
    */
    try {
      const decodedToken = this.decodeToken();
      return decodedToken.roles.includes('Admin');
    } catch (e) {
      return false;
    }
  }

  checkTokenExpiration() {
    /*
    Se comprueba si el token ha expirado.
    */
    if (this.isLoggedIn()) {
    } else {
      this.logout();
    }
    // if (!this.isLoggedIn()) {
    //   this.logout();
    // }
  }

  decodeToken(): any {
    /*
    Se decodifica el token y se retorna
    */
    const token = this.getToken();
    if (token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        console.error('Error decoding token', e);
        return null;
      }
    }
    return null;
  }

  getToken(): string {
    /*
    Se obtiene el token del localStorage.
    */
    let token = localStorage.getItem(this.tokenKey);
    if (token) {
      return token;
    }
    return '';
  }

  getRoles(): string[] {
    /*
    Se obtienen los roles del usuario.
    */
    try {
      const decodedToken = this.decodeToken();
      return decodedToken.roles;
    } catch (e) {
      return [];
    }
  }

  getAlias(): string | null {
    /* 
    Se obtiene el alias del usuario.
    */
    try {
      const decodedToken = this.decodeToken();
      return decodedToken.sub;
    } catch (e) {
      return null;
    }
  }
}
