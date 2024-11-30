import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompNotificacionComponent } from './comp-notificacion.component';

describe('CompNotificacionComponent', () => {
  let component: CompNotificacionComponent;
  let fixture: ComponentFixture<CompNotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompNotificacionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CompNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
