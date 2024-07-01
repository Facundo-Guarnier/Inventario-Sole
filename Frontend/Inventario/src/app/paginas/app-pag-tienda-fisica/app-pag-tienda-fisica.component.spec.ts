import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPagTiendaFisicaComponent } from './app-pag-tienda-fisica.component';

describe('AppPagTiendaFisicaComponent', () => {
  let component: AppPagTiendaFisicaComponent;
  let fixture: ComponentFixture<AppPagTiendaFisicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // imports: [AppPagTiendaFisicaComponent]
      declarations: [AppPagTiendaFisicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppPagTiendaFisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
