import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root",
})

export class ApiBackupService {
  url = "api/bdb"
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  downloadDB(): Observable<Blob> {
    return this.httpClient.get(`${this.url}/download_database`, {
      responseType: 'blob'
    });
  }
  
  uploadDB(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.url}/upload_database`, formData);
  }
}