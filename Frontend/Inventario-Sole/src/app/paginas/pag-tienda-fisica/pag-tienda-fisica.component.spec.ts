import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagTiendaFisicaComponent } from './pag-tienda-fisica.component';

describe('PagTiendaFisicaComponent', () => {
  let component: PagTiendaFisicaComponent;
  let fixture: ComponentFixture<PagTiendaFisicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagTiendaFisicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagTiendaFisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
