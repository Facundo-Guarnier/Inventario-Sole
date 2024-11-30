import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompFiltroCheckboxComponent } from './comp-filtro-checkbox.component';

describe('CompFiltroCheckboxComponent', () => {
  let component: CompFiltroCheckboxComponent;
  let fixture: ComponentFixture<CompFiltroCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompFiltroCheckboxComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompFiltroCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
