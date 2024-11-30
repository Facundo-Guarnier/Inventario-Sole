import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagMovimientosVistaGeneralComponent } from './vista-general.component';

describe('PagMovimientosVistaGeneralComponent', () => {
  let component: PagMovimientosVistaGeneralComponent;
  let fixture: ComponentFixture<PagMovimientosVistaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagMovimientosVistaGeneralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagMovimientosVistaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
