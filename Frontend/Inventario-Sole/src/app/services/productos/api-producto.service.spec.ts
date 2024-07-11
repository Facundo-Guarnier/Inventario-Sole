import { TestBed } from '@angular/core/testing';

import { ApiProductoService } from './api-producto.service';

describe('ApiProductoService', () => {
  let service: ApiProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
