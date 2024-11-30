import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagDevolucionesCrearComponent } from './crear.component';

describe('PagDevolucionesCrearComponent', () => {
  let component: PagDevolucionesCrearComponent;
  let fixture: ComponentFixture<PagDevolucionesCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagDevolucionesCrearComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagDevolucionesCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
