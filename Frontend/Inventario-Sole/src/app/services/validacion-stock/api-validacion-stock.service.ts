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
  
  
  iniciarRondaValidacion(token:string): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)

    return this.httpClient.post(`${this.url}`, {} , {headers: heads} );
  }
  
  obtenerProductosParaValidar(tienda:string): Observable<any> {
    return this.httpClient.get(`${this.url}`, { params: { tienda: tienda } });
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
  
  validarUnidad(idProducto: string, tienda:string, token:string): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.post(`${this.url}`, { id: idProducto, tienda: tienda }, {headers: heads});
  }

  deshacerValidacion(idProducto: string, tienda:string, token:string): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.post(`${this.url}`, { deshacer: true, id: idProducto, tienda: tienda }, {headers: heads});
  }
}