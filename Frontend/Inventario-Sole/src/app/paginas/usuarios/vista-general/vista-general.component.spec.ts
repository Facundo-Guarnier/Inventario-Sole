import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagUsuarioVistaGeneralComponent } from './vista-general.component';

describe('PagUsuarioVistaGeneralComponent', () => {
  let component: PagUsuarioVistaGeneralComponent;
  let fixture: ComponentFixture<PagUsuarioVistaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagUsuarioVistaGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagUsuarioVistaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
