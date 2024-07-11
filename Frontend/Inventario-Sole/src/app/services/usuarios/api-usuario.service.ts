import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root",
})

export class ApiUsuarioService {
  url = "http://localhost:5000/api/usuario"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_x_id(id:string, pagina: number = 1): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  } 
  
  editar(id:string, usuario: {}): Observable<any> {
    return this.httpClient.put(`${this.url}/${id}`, usuario);
  }
  
  eliminar(id:string): Observable<any> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }
  
}

@Injectable({
  providedIn: "root",
})

export class ApiUsuariosService {
  url = "http://localhost:5000/api/usuarios"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_x_atributo(filtro:{}): Observable<any> {
    return this.httpClient.get(`${this.url}`, { params: filtro });
  }  
  
  // crear(usuario: {}): Observable<any> {
  //   return this.httpClient.post(`${this.url}`, usuario);
  // }

}