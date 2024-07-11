import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagUsuarioDetalleEditarComponent } from './detalle-editar.component';

describe('PagUsuarioDetalleEditarComponent', () => {
  let component: PagUsuarioDetalleEditarComponent;
  let fixture: ComponentFixture<PagUsuarioDetalleEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagUsuarioDetalleEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagUsuarioDetalleEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
