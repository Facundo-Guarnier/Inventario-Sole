import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompTablaDatosComponent } from './comp-tabla-datos.component';

describe('CompTablaDatosComponent', () => {
  let component: CompTablaDatosComponent;
  let fixture: ComponentFixture<CompTablaDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompTablaDatosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompTablaDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
