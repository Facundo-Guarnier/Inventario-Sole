import { TestBed } from '@angular/core/testing';

import { ApiMovimientosService } from './api-movimiento.service';

describe('ApiMovimientosService', () => {
  let service: ApiMovimientosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMovimientosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
