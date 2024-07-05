import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

//! Definir la estructura de los atributos de una clase
interface Columna {
  nombre: string;
  tipo: string;
}

interface Accion {
  editar?: boolean;
  eliminar?: boolean;
  detalle?: boolean;
}

@Component({
  selector: 'app-comp-tabla-datos',
  templateUrl: './comp-tabla-datos.component.html',
  styleUrls: ['./comp-tabla-datos.component.css']
})
export class CompTablaDatosComponent implements OnInit {

  @Input() columnas: Columna[] = [];
  @Input() datos: any[] = [];
  @Input() acciones: Accion = {};

  editarFila(item: any) {
    // Lógica para editar
    console.log('Editar', item);
  }

  eliminarFila(item: any) {
    // Lógica para eliminar
    console.log('Eliminar', item);
  }

  detalleFila(item: any) {
    // Lógica para detalle
    console.log('Detalle', item);
    // this.router.navigate(['/productos/detalle-editar', item.id]);
  }
  

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}
