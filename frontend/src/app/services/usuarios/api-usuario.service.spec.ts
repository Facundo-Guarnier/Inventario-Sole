import { TestBed } from '@angular/core/testing';

import { ApiUsuariosService } from './api-usuario.service';

describe('ApiUsuariosService', () => {
  let service: ApiUsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
