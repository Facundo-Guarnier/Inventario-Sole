import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Campo } from '../../interfaces/campo.interface';
import { CompCampoFotosComponent } from '../comp-campo-fotos/comp-campo-fotos.component';

@Component({
  selector: 'app-comp-detalle-nuevo-generico',
  templateUrl: './comp-detalle-nuevo-generico.component.html',
  styleUrls: ['./comp-detalle-nuevo-generico.component.css']
})
export class CompDetalleNuevoGenericoComponent implements OnInit {
  
  @Input() estilo: string = "normal";  //! "normal" o "compacto"
  @Input() titulo: string = "Nuevo Detalle";
  @Input() campos: Campo[] = [];  //! Nombre, identificador y tipo. Ej: "Cantidad", "cantidad", "input-number"
  
  @Output() datosRecolectados = new EventEmitter<any[]>();
  

  constructor() { }

  ngOnInit(): void {
  }

  
  
}


// Lee mal los campos de la tarjeta "detalle de la venta" pero si se comenta esa tarjeta, lee bien los campos de la tarjeta "productos".
// Ver si se puede hacer que el boton flotante de aceptar lea los campos de ambas tarjetas correctamente.
// Separar app-comp-detalle-nuevo-generico en dos componentes, uno el estilo compacto y el otro el estilo NumberFormatStyle, ya que el compoacto 
// tiene funcionalidades propias y botones propios que no tiene el otro.