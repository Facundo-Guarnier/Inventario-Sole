import { TestBed } from '@angular/core/testing';

import { ApiMovimientoService } from './api-movimiento.service';

describe('ApiMovimientoService', () => {
  let service: ApiMovimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMovimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
