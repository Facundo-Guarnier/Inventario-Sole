import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Inventario-Sole';
  constructor(private authService: AuthService) {}

  ngOnInit() {
    interval(10000).subscribe(() => {
      this.authService.checkTokenExpiration();
    });
  }
}
