import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompDetalleNuevoComponent } from './comp-detalle-nuevo-prod.component';

describe('CompDetalleCuerpoComponent', () => {
  let component: CompDetalleNuevoComponent;
  let fixture: ComponentFixture<CompDetalleNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompDetalleNuevoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompDetalleNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
