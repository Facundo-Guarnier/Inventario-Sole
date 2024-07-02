import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompBusquedaComponent } from './comp-busqueda.component';

describe('CompBusquedaComponent', () => {
  let component: CompBusquedaComponent;
  let fixture: ComponentFixture<CompBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompBusquedaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
