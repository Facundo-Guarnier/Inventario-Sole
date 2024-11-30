import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comp-detalle-lateral',
  templateUrl: './comp-detalle-lateral.component.html',
  styleUrls: ['./comp-detalle-lateral.component.css'],
})
export class CompDetalleLateralComponent implements OnInit {
  @Input() datos: any;

  constructor() {}

  ngOnInit(): void {}
}
