import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagTiendaFisicaRevisarStockComponent } from './revisar-stock.component';

describe('PagTiendaFisicaRevisarStockComponent', () => {
  let component: PagTiendaFisicaRevisarStockComponent;
  let fixture: ComponentFixture<PagTiendaFisicaRevisarStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagTiendaFisicaRevisarStockComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PagTiendaFisicaRevisarStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
