import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompDetalleCuerpoComponent } from './comp-detalle-cuerpo.component';

describe('CompDetalleCuerpoComponent', () => {
  let component: CompDetalleCuerpoComponent;
  let fixture: ComponentFixture<CompDetalleCuerpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompDetalleCuerpoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompDetalleCuerpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
