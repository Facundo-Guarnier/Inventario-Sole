import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagTiendaFisicaEditarComponent } from './pag-tienda-fisica-editar.component';

describe('PagTiendaFisicaEditarComponent', () => {
  let component: PagTiendaFisicaEditarComponent;
  let fixture: ComponentFixture<PagTiendaFisicaEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagTiendaFisicaEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagTiendaFisicaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
