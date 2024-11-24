import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    //* Interceptor que captura todas las respuestas HTTP y 
    //* verifique si hay errores de autenticación.
    //* Para ver si hay problemas con el token
    
    constructor(private router: Router, private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    //! Token expirado o inválido
                    this.authService.logout();
                    this.router.navigate(['login']);
                }
                return throwError(error);
            })
        );
    }
}