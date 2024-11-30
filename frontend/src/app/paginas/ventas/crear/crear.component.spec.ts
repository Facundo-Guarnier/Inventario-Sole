import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagVentasCrearComponent } from './crear.component';

describe('PagVentasCrearComponent', () => {
  let component: PagVentasCrearComponent;
  let fixture: ComponentFixture<PagVentasCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagVentasCrearComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PagVentasCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
