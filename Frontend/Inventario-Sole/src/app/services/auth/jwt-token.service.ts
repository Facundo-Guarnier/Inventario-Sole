import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  private tokenKey = 'token';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
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

  isAdmin(): boolean {
    try {
      const decodedToken = this.decodeToken();
      return decodedToken.roles.includes("Admin");
    } catch (e) {
      return false;
    }
  }
}
