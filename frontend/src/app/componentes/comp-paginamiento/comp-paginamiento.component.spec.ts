import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompPaginamientoComponent } from './comp-paginamiento.component';

describe('CompPaginamientoComponent', () => {
  let component: CompPaginamientoComponent;
  let fixture: ComponentFixture<CompPaginamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompPaginamientoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompPaginamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
