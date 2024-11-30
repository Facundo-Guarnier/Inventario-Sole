import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompBarraLateralComponent } from './comp-barra-lateral.component';

describe('CompBarraLateralComponent', () => {
  let component: CompBarraLateralComponent;
  let fixture: ComponentFixture<CompBarraLateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompBarraLateralComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompBarraLateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
