import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaGeneralComponent } from './vista-general.component';

describe('VistaGeneralComponent', () => {
  let component: VistaGeneralComponent;
  let fixture: ComponentFixture<VistaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
