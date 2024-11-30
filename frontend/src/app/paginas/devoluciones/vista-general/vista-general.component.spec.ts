import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagDevolucionesVistaGeneralComponent } from './vista-general.component';

describe('PagDevolucionesVistaGeneralComponent', () => {
  let component: PagDevolucionesVistaGeneralComponent;
  let fixture: ComponentFixture<PagDevolucionesVistaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagDevolucionesVistaGeneralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagDevolucionesVistaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
