import { TestBed } from '@angular/core/testing';

import { ApiVentaService } from './api-venta.service';

describe('ApiVentaService', () => {
  let service: ApiVentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiVentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
