import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagTiendaFisicaVistaGeneralComponent } from './vista-general.component';

describe('PagTiendaFisicaVistaGeneralComponent', () => {
  let component: PagTiendaFisicaVistaGeneralComponent;
  let fixture: ComponentFixture<PagTiendaFisicaVistaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagTiendaFisicaVistaGeneralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagTiendaFisicaVistaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
