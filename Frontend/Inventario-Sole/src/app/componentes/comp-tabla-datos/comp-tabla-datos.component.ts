import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comp-tabla-datos',
  templateUrl: './comp-tabla-datos.component.html',
  styleUrls: ['./comp-tabla-datos.component.css']
})
export class CompTablaDatosComponent implements OnInit {

  @Input() productos: any; 
  
  constructor() { }

  ngOnInit(): void {
  }

}
