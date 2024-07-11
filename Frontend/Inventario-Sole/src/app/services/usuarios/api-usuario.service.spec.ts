import { TestBed } from '@angular/core/testing';

import { ApiUsuarioService } from './api-usuario.service';

describe('ApiUsuarioService', () => {
  let service: ApiUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
