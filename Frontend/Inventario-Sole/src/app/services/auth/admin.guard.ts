import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiAuthService } from './api-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: ApiAuthService, 
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log("ESTA logeado?:", this.authService.isLoggedIn());
    console.log("Es admin?:", this.authService.isAdmin());

    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    } else {
      this.router.navigate(['ven']);
      return false;
    }
  }
}