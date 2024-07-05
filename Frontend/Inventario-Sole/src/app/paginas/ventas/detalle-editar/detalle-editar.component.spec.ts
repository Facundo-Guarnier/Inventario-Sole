import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagVentasDetalleEditarComponent } from './detalle-editar.component';

describe('PagVentasDetalleEditarComponent', () => {
  let component: PagVentasDetalleEditarComponent;
  let fixture: ComponentFixture<PagVentasDetalleEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagVentasDetalleEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagVentasDetalleEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
