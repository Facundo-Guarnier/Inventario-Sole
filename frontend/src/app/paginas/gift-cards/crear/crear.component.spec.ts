import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagGiftCardsCrearComponent } from './crear.component';

describe('PagGiftCardsCrearComponent', () => {
  let component: PagGiftCardsCrearComponent;
  let fixture: ComponentFixture<PagGiftCardsCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagGiftCardsCrearComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PagGiftCardsCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
