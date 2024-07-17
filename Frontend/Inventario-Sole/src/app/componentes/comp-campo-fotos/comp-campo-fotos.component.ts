import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiProductoService } from 'src/app/services/productos/api-producto.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiFotoService, ApiFotosService } from 'src/app/services/fotos/api-foto.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-comp-campo-fotos',
  templateUrl: './comp-campo-fotos.component.html',
  styleUrls: ['./comp-campo-fotos.component.css']
})
export class CompCampoFotosComponent {
  @Input() mostrarEditar: boolean = false;
  @Input() listaFotos: {filename: string, url: SafeUrl}[] = [];
  @Output() fotosActualizadas = new EventEmitter<{filename: string, url: SafeUrl}[]>();

  constructor(
    private authService: AuthService,
    private apiFoto: ApiFotoService,
    private apiFotos: ApiFotosService,
    private sanitizer: DomSanitizer
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.apiFotos.subirFoto(file, this.authService.getToken()).subscribe(
        (response) => {
          if (response && response.filename) {
            this.obtenerYMostrarFoto(response.filename);
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

  obtenerYMostrarFoto(filename: string): void {
    this.apiFoto.obtenerFoto(filename, this.authService.getToken()).subscribe(
      (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        this.listaFotos.push({filename: filename, url: safeUrl});
        // Cambia esta línea:
        this.fotosActualizadas.emit(this.listaFotos);
      },
      (error) => {
        console.error('Error al obtener la foto:', error);
      }
    );
  }
  
  eliminarFoto(index: number): void {
    URL.revokeObjectURL(this.listaFotos[index].url.toString());
    this.listaFotos.splice(index, 1);
    this.fotosActualizadas.emit(this.listaFotos);
  }
}