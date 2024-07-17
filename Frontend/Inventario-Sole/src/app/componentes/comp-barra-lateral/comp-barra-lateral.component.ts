import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Filtro } from '../../interfaces/filtro.interface'
import { AuthService } from 'src/app/services/auth/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-comp-barra-lateral',
  templateUrl: './comp-barra-lateral.component.html',
  styleUrls: ['./comp-barra-lateral.component.css']
})
export class CompBarraLateralComponent implements OnInit {

  //! Valores del componente padre
  @Input() filtrosLista: Filtro[] = [];
  @Input() filtrosCheckbox: {nombre:string, identificador: string, seleccionado:boolean}[] = [];
  
  urlActual: string[] = this.router.url.split('?')[0].split('/').slice(1);
  
  //! Busqueda
  @Output() clickBuscar = new EventEmitter<string>();
  @Output() clickFiltro = new EventEmitter<{nombre: string, valor: string}>();
  busqueda: string = '';

  //! Usuario
  userName: string | null = null;
  remainingTime: string = '';
  private timerSubscription: Subscription | null = null;

  //* ------------------------------------------------------------
  
  constructor(
    private router: Router,
    public authService: AuthService,
  ) { }
  
  ngOnInit(): void {
    this.updateUserInfo();
    this.startTimer();
  }
  
  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  updateUserInfo(): void {
    this.userName = this.authService.getAlias();
  }

  startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateRemainingTime();
    });
  }

  updateRemainingTime(): void {
    const token = this.authService.getToken();
    if (token) {
      const expirationTime = this.authService.jwtHelper.getTokenExpirationDate(token);
      if (expirationTime) {
        const now = new Date();
        const timeLeft = expirationTime.getTime() - now.getTime();
        if (timeLeft > 0) {
          const minutes = Math.floor(timeLeft / 60000);
          const seconds = Math.floor((timeLeft % 60000) / 1000);
          this.remainingTime = `${minutes}m ${seconds}s`;
        } else {
          this.remainingTime = 'Expirado';
          this.authService.logout();
        }
      }
    }
  }

  logout() {
    this.authService.logout();
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }





  //T* Funciones
  //! Para mostar u ocultar los filtros
  mostrarBusqueda(): boolean {
    //! Activa o desactiva la barra de busqueda en base a la pag actual.
    if (this.urlActual.length > 1) {
      return false
    }
    return ['tf', 'to', 'gc', 'reg', 'ven', 'mov', "usu"].includes(this.urlActual[0]);
  }
  
  mostrarFiltroListaSeleccion(): boolean {
    //! Activa o desactiva el filtro de lista de seleccion en base a la pag actual.
    if (this.urlActual.length > 1) {
      return false
    }
    return ['tf', 'to', 'gc', 'reg', 'ven', 'mov', "usu"].includes(this.urlActual[0]);
  }
  
  mostrarFiltroCheckbox(): boolean {
    //! Activa o desactiva el filtro de checkbox en base a la pag actual.
    if (this.urlActual.length > 1) {
      return false
    }
    return ['tf', 'to', 'gc', 'reg', 'ven', 'mov', "usu"].includes(this.urlActual[0]);
  }
  
  mostrarDetalleLateral(): boolean {
    //! Activa o desactiva el detalle lateral en base a la página actual.
    // if (this.urlActual.length > 1) {
    //   return ["prod"].includes(this.urlActual[0]) && this.urlActual[1].includes('detalle-editar');
    // }
    return false;
  }
  
  //! Busqueda
  ClickBuscar(data: string) {
    this.clickBuscar.emit(data);
  }
  
  ClickFiltro(data: {nombre: string, valor: string}) {
    this.clickFiltro.emit(data);
  }
}