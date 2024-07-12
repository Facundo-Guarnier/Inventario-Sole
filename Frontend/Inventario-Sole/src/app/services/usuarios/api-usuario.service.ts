import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root",
})

export class ApiUsuarioService {
  url = "http://localhost:5000/api/usuario"
  
  constructor(
    private httpClient: HttpClient,
    
  ) { }
  
  buscar_x_id(id:string, pagina: number = 1, token:any): Observable<any> {
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
  url = "http://localhost:5000/api/usuarios"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_x_atributo(filtro:{}, token:any): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.get(`${this.url}`, { params: filtro, headers: heads});
  }
}