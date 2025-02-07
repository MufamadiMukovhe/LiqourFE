import { TestBed } from '@angular/core/testing';

import { GisOfflineService } from './gis-offline.service';

describe('GisOfflineService', () => {
  let service: GisOfflineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GisOfflineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
