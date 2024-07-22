import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root",
})

export class ApiFotoService {
  url = "/api/foto"
  
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
  url = "/api/fotos"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  subirFoto(file: File, productoId: string, token: string): Observable<any> {
    let formData = new FormData();
    formData.append('foto', file);
    formData.append('producto_id', productoId);
    
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.httpClient.post(`${this.url}`, formData, {headers: headers});
  }

}