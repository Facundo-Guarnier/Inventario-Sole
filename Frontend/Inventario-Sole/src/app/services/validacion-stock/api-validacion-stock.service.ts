import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root",
})

export class ApiRondaValidacionStock {
  url = "http://localhost:5000/api/ronda-validacion"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  
  iniciarRondaValidacion(): Observable<any> {
    return this.httpClient.post(`${this.url}`, {});
  }
  
  obtenerProductosParaValidar(): Observable<any> {
    return this.httpClient.get(`${this.url}`);
  }
}

//* ------------------------------------------------------------

@Injectable({
  providedIn: "root",
})

export class ApiValidarStock {
  url = "http://localhost:5000/api/validar"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  validarUnidad(idProducto: string): Observable<any> {
    return this.httpClient.post(`${this.url}`, { id: idProducto });
  }
}