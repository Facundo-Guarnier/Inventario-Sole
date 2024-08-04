import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})

export class ApiMeliService {
  url = "/api/meli"
  constructor(
    private httpClient: HttpClient
  ) { }

  get(url: string, token:string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get(`${this.url}`, {headers: headers, params: {url: url}});
  }

  post(url: string, body: any, token:string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(`${this.url}`, body, {headers: headers, params: {url: url}});
  }


}