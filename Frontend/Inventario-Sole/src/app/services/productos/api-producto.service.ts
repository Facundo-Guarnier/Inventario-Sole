import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root",
})

@Injectable({
  providedIn: 'root'
})
export class ApiProductoService {
  url = "http://localhost:5000/api/producto"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_x_id(id:string, pagina: number = 1): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  } 
  
  actualizar(id:string, producto: {}): Observable<any> {
    return this.httpClient.put(`${this.url}/${id}`, producto);
  }
  
  eliminar(id:string): Observable<any> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }
  
}

@Injectable({
  providedIn: "root",
})

export class ApiProductosService {
  url = "http://localhost:5000/api/productos"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_x_atributo(filtro:{}): Observable<any> {
    return this.httpClient.get(`${this.url}`, { params: filtro });
  }  
  
  crear(producto: {}): Observable<any> {
    return this.httpClient.post(`${this.url}`, producto);
  }

}