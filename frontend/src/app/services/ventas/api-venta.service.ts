import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiVentaService {
  url = '/api/venta';

  constructor(private httpClient: HttpClient) {}

  buscar_x_id(id: string = 'a', pagina: number = 1): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  }

  actualizar(id: string, venta: {}, token: any): Observable<any> {
    let heads = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Bearer ' + token);
    return this.httpClient.put(`${this.url}/${id}`, venta, { headers: heads });
  }

  eliminar(id: string, token: any): Observable<any> {
    let heads = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Bearer ' + token);
    return this.httpClient.delete(`${this.url}/${id}`, { headers: heads });
  }
}

//* ------------------------------------------------------------

@Injectable({
  providedIn: 'root'
})
export class ApiVentasService {
  url = '/api/ventas';

  constructor(private httpClient: HttpClient) {}

  buscar_x_atributo(
    filtro: {},
    pagina: number,
    por_pagina: number
  ): Observable<any> {
    return this.httpClient.get(`${this.url}`, {
      params: { ...filtro, pagina: pagina, por_pagina: por_pagina }
    });
  }

  crear(venta: {}, token: any): Observable<any> {
    let heads = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Bearer ' + token);
    return this.httpClient.post(`${this.url}`, venta, { headers: heads });
  }
}
