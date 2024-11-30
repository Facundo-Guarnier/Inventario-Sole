import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagTiendaOnlineRevisarStockComponent } from './revisar-stock.component';

describe('PagTiendaOnlineRevisarStockComponent', () => {
  let component: PagTiendaOnlineRevisarStockComponent;
  let fixture: ComponentFixture<PagTiendaOnlineRevisarStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagTiendaOnlineRevisarStockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagTiendaOnlineRevisarStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
