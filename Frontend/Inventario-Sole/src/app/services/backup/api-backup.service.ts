import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root",
})


export class ApiBackupService {
  url = "api/bdb"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  downloadDB(): Observable<Blob> {
    return this.httpClient.get(`${this.url}/download_database`, {
      responseType: 'blob'
    });
  }
}

//* ------------------------------------------------------------

// @Injectable({
//   providedIn: "root",
// })

// export class ApiBackupsService {
//   url = "/api/movimientos"
  
//   constructor(
//     private httpClient: HttpClient
//   ) { }
  
//   buscar_x_atributo(filtro:{}, pagina:number, por_pagina:number ): Observable<any> {
//     return this.httpClient.get(`${this.url}`, { params: {...filtro, pagina: pagina, por_pagina: por_pagina } });
//   }  
  
//   crear(movimiento: {}, token:any): Observable<any> {
//     let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
//     return this.httpClient.post(`${this.url}`, movimiento, {headers: heads});
//   }

// }