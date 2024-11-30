import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Columna } from '../../interfaces/columna.interface';
import { Accion } from '../../interfaces/accion.interface';

@Component({
  selector: 'app-comp-tabla-datos',
  templateUrl: './comp-tabla-datos.component.html',
  styleUrls: ['./comp-tabla-datos.component.css'],
})
export class CompTablaDatosComponent implements OnInit {
  @Input() tipo: string = ''; //! Para saber a que ruta redirigir

  @Input() columnas: Columna[] = [];
  @Input() datos: any[] = [];
  @Input() acciones: Accion = {}; //! Distingue boolean, currency, date (yyyy/mm/dd) o text

  @Input() datosSecundarios: any[] = [];
  @Input() columnasSecundarias: Columna[] = [];

  //* ------------------------------------------------------------

  constructor(private router: Router) {}

  ngOnInit(): void {}

  //T* Funciones
  //! Botones
  editarFila(item: any) {
    if (this.tipo === 'mov') {
      this.router.navigate([this.tipo + '/detalle']);
    } else if (this.tipo == 'usu') {
      this.router.navigate([this.tipo + '/detalle-editar/' + item.alias], {
        queryParams: { editar: true },
      });
    } else {
      this.router.navigate([this.tipo + '/detalle-editar/' + item.id], {
        queryParams: { editar: true },
      });
    }
  }

  eliminarFila(item: any) {
    console.log('Eliminar', item);
    this.datos = this.datos.filter((dato) => dato !== item);
  }

  detalleFila(item: any) {
    if (this.tipo === 'mov') {
      this.router.navigate([this.tipo + '/detalle']);
    } else if (this.tipo == 'usu') {
      this.router.navigate([this.tipo + '/detalle-editar/' + item.alias], {
        queryParams: { editar: false },
      });
    } else {
      this.router.navigate([this.tipo + '/detalle-editar/' + item.id], {
        queryParams: { editar: false },
      });
    }
  }

  //! Mostrar flecha de expandir/contraer datos secundarios
  mostrarFlecha(): boolean {
    return this.datosSecundarios.length > 0;
  }
}
