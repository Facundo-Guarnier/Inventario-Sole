import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompCampoFotosComponent } from './comp-campo-fotos.component';

describe('CompCampoFotosComponent', () => {
  let component: CompCampoFotosComponent;
  let fixture: ComponentFixture<CompCampoFotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompCampoFotosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompCampoFotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
