import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompFiltroListaSeleccionComponent } from './comp-filtro-lista-seleccion.component';

describe('CompFiltroListaSeleccionComponent', () => {
  let component: CompFiltroListaSeleccionComponent;
  let fixture: ComponentFixture<CompFiltroListaSeleccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompFiltroListaSeleccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompFiltroListaSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
