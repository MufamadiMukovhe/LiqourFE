import { TestBed } from '@angular/core/testing';

import { ServeNoticeService } from './serve-notice.service';

describe('ServeNoticeService', () => {
  let service: ServeNoticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServeNoticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
