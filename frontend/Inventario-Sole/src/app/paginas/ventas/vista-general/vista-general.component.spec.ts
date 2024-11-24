import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagVentasVistaGeneralComponent } from './vista-general.component';

describe('PagVentasVistaGeneralComponent', () => {
  let component: PagVentasVistaGeneralComponent;
  let fixture: ComponentFixture<PagVentasVistaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagVentasVistaGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagVentasVistaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
