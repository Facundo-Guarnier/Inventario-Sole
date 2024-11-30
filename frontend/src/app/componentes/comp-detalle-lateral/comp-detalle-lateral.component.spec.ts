import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompDetalleLateralComponent } from './comp-detalle-lateral.component';

describe('CompDetalleComponent', () => {
  let component: CompDetalleLateralComponent;
  let fixture: ComponentFixture<CompDetalleLateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompDetalleLateralComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompDetalleLateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
