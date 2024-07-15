import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiProductoService } from 'src/app/services/productos/api-producto.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-comp-campo-fotos',
  templateUrl: './comp-campo-fotos.component.html',
  styleUrls: ['./comp-campo-fotos.component.css']
})
export class CompCampoFotosComponent {
  @Input() mostrarEditar: boolean = false;
  @Input() listaFotos: string[] = [];
  @Output() fotosActualizadas = new EventEmitter<string[]>();

  constructor(
    private apiProductoService: ApiProductoService,
    private authService: AuthService
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    console.log('Archivo seleccionado:', file);
    if (file) {
      this.apiProductoService.subirFoto(file, this.authService.getToken()).subscribe(
        (response) => {
          const nuevaUrl = this.apiProductoService.obtenerUrlFoto(response.filename);
          this.listaFotos.push(nuevaUrl);
          this.fotosActualizadas.emit(this.listaFotos);
        },
        (error) => {
          console.error('Error al subir la foto:', error);
        }
      );
    }
  }

  eliminarFoto(index: number): void {
    this.listaFotos.splice(index, 1);
    this.fotosActualizadas.emit(this.listaFotos);
  }
}