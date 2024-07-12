import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UltimasIDsService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  url = "http://127.0.0.1:5000/api/ultimaid"

  buscar_proxima_id(coleccion: string, token:any): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    return this.httpClient.get(`${this.url}/${coleccion}`, {headers: heads});
  }
}
