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

  obtenerFoto(filename: string, token: string): Observable<Blob> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get(`${this.url}/${filename}`, {
      responseType: 'blob',
      headers: headers
    });
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
  
  subirFoto(file: File, token: string): Observable<any> {
    let heads = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const formData = new FormData();
    formData.append('foto', file);
    return this.httpClient.post(`${this.url}`, formData, {headers: heads});
  }

}