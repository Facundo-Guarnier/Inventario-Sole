import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagUsuarioCrearComponent } from './crear.component';

describe('PagUsuarioCrearComponent', () => {
  let component: PagUsuarioCrearComponent;
  let fixture: ComponentFixture<PagUsuarioCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagUsuarioCrearComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagUsuarioCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
