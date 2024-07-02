import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompDetalleComponent } from './comp-detalle.component';

describe('CompDetalleComponent', () => {
  let component: CompDetalleComponent;
  let fixture: ComponentFixture<CompDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
