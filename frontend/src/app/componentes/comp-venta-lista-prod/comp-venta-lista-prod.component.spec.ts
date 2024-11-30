import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompVentaListaProdComponent } from './comp-venta-lista-prod.component';

describe('CompVentaListaProdComponent', () => {
  let component: CompVentaListaProdComponent;
  let fixture: ComponentFixture<CompVentaListaProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompVentaListaProdComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompVentaListaProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
