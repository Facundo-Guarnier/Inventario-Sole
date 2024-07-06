import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comp-navbar',
  templateUrl: './comp-navbar.component.html',
  styleUrls: ['./comp-navbar.component.css']
})
export class CompNavbarComponent implements OnInit {

  pagActual: string = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pagActual = this.router.url.split('/')[1].split('?')[0];
  }

}
