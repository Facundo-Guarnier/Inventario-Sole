import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {
  url = "http://localhost:5000/api/auth"

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  login(dataLogin:any): Observable<any> {  
    return this.httpClient.post(this.url + '/acceder', dataLogin).pipe(take(1))
  }

  logout() {
    console.log("Cerrando sesion")
    localStorage.clear()
    // this.router.navigate(["Home/1"])
  }

  register(dataRegister:{}): Observable<any> {
    return this.httpClient.post(this.url + '/registrar', dataRegister).pipe(take(1))
  }
}
