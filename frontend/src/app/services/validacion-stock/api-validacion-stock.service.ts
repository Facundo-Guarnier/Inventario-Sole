import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiRondaValidacionStock {
  url = '/api/ronda-validacion';

  constructor(private httpClient: HttpClient) {}

  iniciarRondaValidacion(token: string, tienda: string): Observable<any> {
    let heads = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Bearer ' + token);
    return this.httpClient.post(
      `${this.url}`,
      { tienda: tienda },
      { headers: heads }
    );
  }

  obtenerProductosParaValidar(
    tienda: string,
    pagina: number,
    por_pagina: number
  ): Observable<any> {
    return this.httpClient.get(`${this.url}`, {
      params: { tienda: tienda, pagina: pagina, por_pagina: por_pagina }
    });
  }
}

//* ------------------------------------------------------------

@Injectable({
  providedIn: 'root'
})
export class ApiValidarStock {
  url = '/api/validacion-stock';

  constructor(private httpClient: HttpClient) {}

  validarUnidad(
    idProducto: string,
    cantidad: number,
    tienda: string,
    token: string
  ): Observable<any> {
    let heads = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Bearer ' + token);
    return this.httpClient.post(
      `${this.url}`,
      { id: idProducto, tienda: tienda, cantidad: cantidad },
      { headers: heads }
    );
  }

  deshacerValidacion(
    idProducto: string,
    cantidad: number,
    tienda: string,
    token: string
  ): Observable<any> {
    let heads = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Bearer ' + token);
    return this.httpClient.post(
      `${this.url}`,
      { deshacer: true, id: idProducto, tienda: tienda, cantidad: cantidad },
      { headers: heads }
    );
  }
}
