import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagUsuarioIniciarSesionComponent } from './iniciar-sesion.component';

describe('PagUsuarioIniciarSesionComponent', () => {
  let component: PagUsuarioIniciarSesionComponent;
  let fixture: ComponentFixture<PagUsuarioIniciarSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagUsuarioIniciarSesionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagUsuarioIniciarSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
