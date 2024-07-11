import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtTokenService } from 'src/app/services/auth/jwt-token.service';

@Component({
  selector: 'app-comp-navbar',
  templateUrl: './comp-navbar.component.html',
  styleUrls: ['./comp-navbar.component.css']
})
export class CompNavbarComponent implements OnInit {

  pagActual: string = '';

  admin: boolean = this.jwtTokenService.isAdmin();

  constructor(
    private router: Router,
    private jwtTokenService: JwtTokenService
  ) { }

  ngOnInit(): void {
    this.pagActual = this.router.url.split('/')[1].split('?')[0];
  }

}
