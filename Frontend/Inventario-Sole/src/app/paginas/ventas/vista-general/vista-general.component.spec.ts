import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagVentasComponent } from './vista-general.component';

describe('PagVentasComponent', () => {
  let component: PagVentasComponent;
  let fixture: ComponentFixture<PagVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagVentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
