import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagProductosCrearComponent } from './crear.component';

describe('PagProductosCrearComponent', () => {
  let component: PagProductosCrearComponent;
  let fixture: ComponentFixture<PagProductosCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagProductosCrearComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PagProductosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
