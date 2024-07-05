import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comp-navbar',
  templateUrl: './comp-navbar.component.html',
  styleUrls: ['./comp-navbar.component.css']
})
export class CompNavbarComponent implements OnInit {

  @Input() pagActual: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
