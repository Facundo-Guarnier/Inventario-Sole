import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompBotonesFlotantesComponent } from './comp-botones-flotantes.component';

describe('CompBotonesFlotantesComponent', () => {
  let component: CompBotonesFlotantesComponent;
  let fixture: ComponentFixture<CompBotonesFlotantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompBotonesFlotantesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompBotonesFlotantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
