import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root",
})

@Injectable({
  providedIn: 'root'
})
export class ApiVentaService {
  url = "http://localhost:5000/api/venta"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_x_id(id:string="a", pagina: number = 1): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  } 
  
  actualizar(id:string, venta: {}): Observable<any> {
    return this.httpClient.put(`${this.url}/${id}`, venta);
  }
  
  eliminar(id:string): Observable<any> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }
  
}

@Injectable({
  providedIn: "root",
})

export class ApiVentasService {
  url = "http://localhost:5000/api/ventas"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_x_atributo(filtro:{}): Observable<any> {
    return this.httpClient.get(`${this.url}`, { params: filtro });
  }  
  
  crear(venta: {}): Observable<any> {
    return this.httpClient.post(`${this.url}`, venta);
  }

}
