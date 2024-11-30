import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagGiftCardsDetalleEditarComponent } from './detalle-editar.component';

describe('PagGiftCardsDetalleEditarComponent', () => {
  let component: PagGiftCardsDetalleEditarComponent;
  let fixture: ComponentFixture<PagGiftCardsDetalleEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagGiftCardsDetalleEditarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PagGiftCardsDetalleEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
