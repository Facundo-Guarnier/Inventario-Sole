import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagRegalosVistaGeneralComponent } from './vista-general.component';

describe('PagRegalosVistaGeneralComponent', () => {
  let component: PagRegalosVistaGeneralComponent;
  let fixture: ComponentFixture<PagRegalosVistaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagRegalosVistaGeneralComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PagRegalosVistaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
