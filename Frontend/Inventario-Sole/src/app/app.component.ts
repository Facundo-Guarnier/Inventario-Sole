import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { ApiAuthService } from './services/auth/api-auth.service'; 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'Inventario-Sole';
  constructor(private apiAuthService: ApiAuthService) {}

  ngOnInit() {
    // Verifica el token cada minuto
    interval(60000).subscribe(() => {
      this.apiAuthService.checkTokenExpiration();
    });
  }
}