import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: "root",
})

export class ApiUsuarioService {
  url = "/api/usuario"
  
  constructor(
    private httpClient: HttpClient,
    
  ) { }
  
  buscar_x_id(id:string, token:any, pagina: number = 1, ): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.get(`${this.url}/${id}`, {headers: heads});
  } 
  
  editar(id:string, usuario: {}, token:any): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.put(`${this.url}/${id}`, usuario, {headers: heads});
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

export class ApiUsuariosService {
  url = "/api/usuarios"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_todos(token:any, pagina:number, por_pagina:number ): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.get( `${this.url}`, { headers: heads, params: { pagina: pagina, por_pagina: por_pagina } } );
  }
}