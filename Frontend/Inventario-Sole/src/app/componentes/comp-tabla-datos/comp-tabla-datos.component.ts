import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Columna } from '../../interfaces/columna.interface';
import { Accion } from '../../interfaces/accion.interface';


@Component({
  selector: 'app-comp-tabla-datos',
  templateUrl: './comp-tabla-datos.component.html',
  styleUrls: ['./comp-tabla-datos.component.css']
})

export class CompTablaDatosComponent implements OnInit {
  
  @Input() columnas: Columna[] = [];
  @Input() datos: any[] = [];
  @Input() acciones: Accion = {}; //! Distingue boolean, currency, date (yyyy/mm/dd) o text
  @Input() tipo: string = ""; //! Para saber a que ruta redirigir
  
  constructor(
    private router: Router
  ) { }
  
  ngOnInit(): void {
  }
  
  editarFila(item: any) {
    if (this.tipo === 'mov') {
      this.router.navigate([this.tipo + '/detalle']);
    } else {
      // this.router.navigate(['prod/detalle-editar', item.id]);
      this.router.navigate([this.tipo + '/detalle-editar']);
    }
  }
  
  eliminarFila(item: any) {
    console.log('Eliminar', item);
    this.datos = this.datos.filter((dato) => dato !== item);
  }
  
  detalleFila(item: any) {
    if (this.tipo === 'mov') {
      this.router.navigate([this.tipo + '/detalle']);
    } else {
      // this.router.navigate(['prod/detalle-editar', item.id]);
      this.router.navigate([this.tipo + '/detalle-editar']);
    }
  }
  
}