import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompDetalleNuevoGenericoComponent } from './comp-detalle-nuevo-generico.component';

describe('CompDetalleNuevoGenericoComponent', () => {
  let component: CompDetalleNuevoGenericoComponent;
  let fixture: ComponentFixture<CompDetalleNuevoGenericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompDetalleNuevoGenericoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompDetalleNuevoGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
