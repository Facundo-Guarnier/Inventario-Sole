import { TestBed } from '@angular/core/testing';

import { ApiVentasService } from './api-venta.service';

describe('ApiVentasService', () => {
  let service: ApiVentasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiVentasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
