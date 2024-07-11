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
  url = "http://localhost:5000/api"
  
  constructor(
    private httpClient: HttpClient
  ) { }

  buscar_x_id(id:string, pagina: number = 1) {
    return this.httpClient.get(`${this.url}/venta/${id}`);
  } 

  actualizar(id:string, venta: {}) {
    return this.httpClient.put(this.url + id, venta);
  }

  eliminar(id:string) {
    return this.httpClient.delete(this.url + id);
  }

}

@Injectable({
  providedIn: "root",
})

export class ApiVentasService {
  url = "http://localhost:5000/api"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  buscar_x_atributo(filtro:{}) {
    console.log(filtro);
    return this.httpClient.get(`${this.url}/ventas`, { params: filtro });
  }  
  
  crear(venta: {}): Observable<any> {
    return this.httpClient.post(`${this.url}/ventas`, venta);
  }

}
