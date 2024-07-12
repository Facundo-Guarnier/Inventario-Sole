import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, take, BehaviorSubject, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})

export class ApiAuthService {
  url = "http://localhost:5000/api/auth";
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();
  private tokenKey = 'token';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
  ) { 
    this.checkToken();
  }

  login(dataLogin: any): Observable<any> {  
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

  logout() {
    localStorage.removeItem('token');
    this.userRoleSubject.next(null);
    this.router.navigate(["login"]);
  }

  register(dataRegister: {}): Observable<any> {
    return this.httpClient.post(this.url + '/registrar', dataRegister).pipe(take(1));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && !this.jwtHelper.isTokenExpired(localStorage.getItem('token'));
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.userRoleSubject.next(decodedToken.role);
    } else {
      this.userRoleSubject.next(null);
    }
  }

  isAdmin(): boolean {
    try {
      const decodedToken = this.decodeToken();
      return decodedToken.roles.includes("Admin");
    } catch (e) {
      return false;
    }
  }

  checkTokenExpiration() {
    if (this.isLoggedIn()) {
      // El token es válido, no hacer nada
    } else {
      this.logout();
    }
  }

  decodeToken(): any {
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

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRoles(): string[] {
    try {
      const decodedToken = this.decodeToken();
      return decodedToken.roles;
    } catch (e) {
      return [];
    }
  }
  
  getAlias(): string | null {
    try {
      const decodedToken = this.decodeToken();
      return decodedToken.alias;
    } catch (e) {
      return null;
    }
  }
}