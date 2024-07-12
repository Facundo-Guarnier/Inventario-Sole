import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiAuthService } from './api-auth.service'; 


@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private apiAuthService: ApiAuthService, private router: Router) {}

    canActivate(): boolean {
        if (this.apiAuthService.isLoggedIn()) {
            return true;
        } else {
        this.router.navigate(['login']);
            return false;
        }
    }
}