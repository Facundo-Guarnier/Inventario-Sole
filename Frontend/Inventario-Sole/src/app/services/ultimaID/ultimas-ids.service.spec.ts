import { TestBed } from '@angular/core/testing';

import { UltimasIDsService } from './ultimas-ids.service';

describe('UltimasIDsService', () => {
  let service: UltimasIDsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UltimasIDsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
