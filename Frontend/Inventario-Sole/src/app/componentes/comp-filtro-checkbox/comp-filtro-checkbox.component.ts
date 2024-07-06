import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comp-filtro-checkbox',
  templateUrl: './comp-filtro-checkbox.component.html',
  styleUrls: ['./comp-filtro-checkbox.component.css']
})
export class CompFiltroCheckboxComponent implements OnInit {

  @Input() filtro: string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
