import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompBotonFotoComponent } from './comp-boton-foto.component';

describe('CompBotonFotoComponent', () => {
  let component: CompBotonFotoComponent;
  let fixture: ComponentFixture<CompBotonFotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompBotonFotoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompBotonFotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
