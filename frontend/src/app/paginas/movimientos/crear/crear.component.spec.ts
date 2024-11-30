import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagMovimientosCrearComponent } from './crear.component';

describe('PagMovimientosCrearComponent', () => {
  let component: PagMovimientosCrearComponent;
  let fixture: ComponentFixture<PagMovimientosCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagMovimientosCrearComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagMovimientosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
