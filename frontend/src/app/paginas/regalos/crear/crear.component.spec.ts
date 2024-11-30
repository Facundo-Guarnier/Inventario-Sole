import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagRegalosCrearComponent } from './crear.component';

describe('PagRegalosCrearComponent', () => {
  let component: PagRegalosCrearComponent;
  let fixture: ComponentFixture<PagRegalosCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagRegalosCrearComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagRegalosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
