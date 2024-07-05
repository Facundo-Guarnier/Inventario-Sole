import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagMovimientosDetalleComponent } from './detalle.component';

describe('PagMovimientosDetalleComponent', () => {
  let component: PagMovimientosDetalleComponent;
  let fixture: ComponentFixture<PagMovimientosDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagMovimientosDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagMovimientosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
