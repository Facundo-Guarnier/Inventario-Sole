import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagProductosDetalleEditarComponent } from './detalle-editar.component';

describe('PagProductosDetalleEditarComponent', () => {
  let component: PagProductosDetalleEditarComponent;
  let fixture: ComponentFixture<PagProductosDetalleEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagProductosDetalleEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagProductosDetalleEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
