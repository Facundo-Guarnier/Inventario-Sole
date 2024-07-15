import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  
  actualizar(id:string, producto: {}, token:any): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.put(`${this.url}/${id}`, producto, {headers: heads});
  }
  
  eliminar(id:string, token:any): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.delete(`${this.url}/${id}`, {headers: heads});
  }
  
  subirFoto(file: File, token: any): Observable<any> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.httpClient.post(`http://localhost:5000/api/imagen`, formData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  obtenerUrlFoto(filename: string): string {
    return `http://localhost:5000/api/imagenes/${filename}`;
  }

}

//* ------------------------------------------------------------

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
  
  crear(producto: {}, token:any): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.post(`${this.url}`, producto, {headers: heads});
  }

}