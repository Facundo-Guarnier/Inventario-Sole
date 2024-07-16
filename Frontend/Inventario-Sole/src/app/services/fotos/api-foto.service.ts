import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root",
})

export class ApiFotoService {
  url = "http://localhost:5000/api/foto"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  obtenerUrlFoto(filename: string): string {
    return `${this.url}/${filename}`;
  }

}

//* ------------------------------------------------------------

@Injectable({
  providedIn: "root",
})

export class ApiFotosService {
  url = "http://localhost:5000/api/fotos"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  subirFoto(file: File, token: any): Observable<any> {
    let heads = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*').set('Authorization', 'Bearer ' + token)
    const formData = new FormData();
    formData.append('foto', file);
    return this.httpClient.post(`${this.url}`, formData, {headers: heads});
  }

}