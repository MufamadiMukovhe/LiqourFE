import { TestBed } from '@angular/core/testing';

import { OfflineSummonService } from './offline-summon.service';

describe('OfflineSummonService', () => {
  let service: OfflineSummonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineSummonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
