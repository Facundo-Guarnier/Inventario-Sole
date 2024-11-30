import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiDevolucionesService {
  url = '/api/devoluciones';

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

  crear(devolucion: {}, token: any): Observable<any> {
    let heads = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', 'Bearer ' + token);
    return this.httpClient.post(`${this.url}`, devolucion, { headers: heads });
  }
}
