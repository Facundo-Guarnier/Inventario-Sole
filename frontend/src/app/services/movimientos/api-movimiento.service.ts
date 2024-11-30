import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiMovimientoService {
  url = '/api/movimiento';

  constructor(private httpClient: HttpClient) {}

  buscar_x_id(id: string, pagina: number = 1): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  }

  actualizar(id: string, movimiento: {}, token: any): Observable<any> {
    let heads = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Bearer ' + token);
    return this.httpClient.put(`${this.url}/${id}`, movimiento, {
      headers: heads,
    });
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
  providedIn: 'root',
})
export class ApiMovimientosService {
  url = '/api/movimientos';

  constructor(private httpClient: HttpClient) {}

  buscar_x_atributo(
    filtro: {},
    pagina: number,
    por_pagina: number,
  ): Observable<any> {
    return this.httpClient.get(`${this.url}`, {
      params: { ...filtro, pagina: pagina, por_pagina: por_pagina },
    });
  }

  crear(movimiento: {}, token: any): Observable<any> {
    let heads = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Bearer ' + token);
    return this.httpClient.post(`${this.url}`, movimiento, { headers: heads });
  }
}
