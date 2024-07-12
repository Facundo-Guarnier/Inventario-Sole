import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiAuthService } from '../../services/auth/api-auth.service';

@Component({
  selector: 'app-comp-navbar',
  templateUrl: './comp-navbar.component.html',
  styleUrls: ['./comp-navbar.component.css']
})
export class CompNavbarComponent implements OnInit {

  pagActual: string = '';

  admin: boolean = this.authServiceService.isAdmin();

  constructor(
    private router: Router,
    private authServiceService: ApiAuthService
  ) { }

  ngOnInit(): void {
    this.pagActual = this.router.url.split('/')[1].split('?')[0];
  }

}
