import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root",
})

@Injectable({
  providedIn: 'root'
})
export class ApiMovimientoService {
  url = "http://localhost:5000/api/movimiento"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_x_id(id:string, pagina: number = 1): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  } 
  
  actualizar(id:string, movimiento: {}): Observable<any> {
    return this.httpClient.put(`${this.url}/${id}`, movimiento);
  }
  
  eliminar(id:string): Observable<any> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }
  
}

@Injectable({
  providedIn: "root",
})

export class ApiMovimientosService {
  url = "http://localhost:5000/api/movimientos"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_x_atributo(filtro:{}): Observable<any> {
    return this.httpClient.get(`${this.url}`, { params: filtro });
  }  
  
  crear(movimiento: {}): Observable<any> {
    return this.httpClient.post(`${this.url}`, movimiento);
  }

}