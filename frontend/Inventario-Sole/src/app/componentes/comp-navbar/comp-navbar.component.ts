import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-comp-navbar',
  templateUrl: './comp-navbar.component.html',
  styleUrls: ['./comp-navbar.component.css']
})
export class CompNavbarComponent implements OnInit {

  pagActual: string = '';

  admin: boolean = this.authService.isAdmin();

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.pagActual = this.router.url.split('/')[1].split('?')[0];
  }

}
