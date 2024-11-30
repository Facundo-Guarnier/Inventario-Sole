import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagRegalosDetalleEditarComponent } from './detalle-editar.component';

describe('PagRegalosDetalleEditarComponent', () => {
  let component: PagRegalosDetalleEditarComponent;
  let fixture: ComponentFixture<PagRegalosDetalleEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagRegalosDetalleEditarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PagRegalosDetalleEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
