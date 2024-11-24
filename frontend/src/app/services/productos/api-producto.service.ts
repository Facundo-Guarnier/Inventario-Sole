import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root",
})

export class ApiProductoService {
  url = "/api/producto"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_x_id(id:string, pagina: number = 1): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  } 
  
  actualizar(id:string, producto: {}, token:any): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.put(`${this.url}/${id}`, producto, {headers: heads});
  }
  
  eliminar(id:string, token:any): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.delete(`${this.url}/${id}`, {headers: heads});
  }

}

//* ------------------------------------------------------------

@Injectable({
  providedIn: "root",
})

export class ApiProductosService {
  url = "/api/productos"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_x_atributo(filtro:{}, pagina:number, por_pagina:number ): Observable<any> {
    return this.httpClient.get(`${this.url}`, { params: {...filtro, pagina: pagina, por_pagina: por_pagina } });
  }  
  
  crear(producto: {}, token:any): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.post(`${this.url}`, producto, {headers: heads});
  }
}

//* ------------------------------------------------------------

@Injectable({
  providedIn: "root",
})

export class ApiRevisarStockService {
  url = "http://localhost:5000/api/revisar-stock"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  revisarStock(id: string, token: string): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.post(`${this.url}`, { id }, {headers: heads});
  }
}