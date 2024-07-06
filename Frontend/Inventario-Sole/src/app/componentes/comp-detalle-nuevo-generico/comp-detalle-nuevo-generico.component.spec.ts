import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompDetalleNuevoMovComponent } from './comp-detalle-nuevo-generico.component';

describe('CompDetalleNuevoMovComponent', () => {
  let component: CompDetalleNuevoMovComponent;
  let fixture: ComponentFixture<CompDetalleNuevoMovComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompDetalleNuevoMovComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompDetalleNuevoMovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
