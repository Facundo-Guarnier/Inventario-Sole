import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiProductoService } from 'src/app/services/productos/api-producto.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiFotoService, ApiFotosService } from 'src/app/services/fotos/api-foto.service';

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
    // private apiProductoService: ApiProductoService,
    private authService: AuthService,
    private apiFoto: ApiFotoService,
    private apiFotos: ApiFotosService,
  ) {}


  //* Cloude 
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.apiFotos.subirFoto(file, this.authService.getToken()).subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
          if (response && response.filename) {
            const nuevaUrl = this.apiFoto.obtenerUrlFoto(response.filename);
            this.listaFotos.push(nuevaUrl);
            this.fotosActualizadas.emit(this.listaFotos);
          } else {
            console.error('La respuesta del servidor no contiene un nombre de archivo válido');
          }
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
  




  //* Gemini
  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0] as File;
  // }

  // subirFoto(): void {
  //   if (this.selectedFile) {
  //     this.apiFotos.subirFoto(this.selectedFile, this.authService.getToken())
  //       .subscribe(
  //         (res: any) => {
  //           console.log('Respuesta del servidor:', res);
  //           this.listaFotos.push(this.apiFoto.obtenerUrlFoto(res.filename));
  //           this.fotosActualizadas.emit(this.listaFotos);
  //         },
  //         (error: any) => {
  //           console.error('Error al subir la foto:', error);
  //         }
  //       );
  //   }
  // }

  // eliminarFoto(index: number): void {
  //   if (this.mostrarEditar) {
  //     this.listaFotos.splice(index, 1);
  //     this.fotosActualizadas.emit(this.listaFotos);
  //   }
  // }
}