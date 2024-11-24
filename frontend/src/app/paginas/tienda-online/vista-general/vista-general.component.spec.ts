import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagTiendaOnlineVistaGeneralComponent } from './vista-general.component';

describe('PagTiendaOnlineVistaGeneralComponent', () => {
  let component: PagTiendaOnlineVistaGeneralComponent;
  let fixture: ComponentFixture<PagTiendaOnlineVistaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagTiendaOnlineVistaGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagTiendaOnlineVistaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
