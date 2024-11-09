import { TestBed } from '@angular/core/testing';

import { DataCapService } from './data-cap.service';

describe('DataCapService', () => {
  let service: DataCapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataCapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
