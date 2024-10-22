import { TestBed } from '@angular/core/testing';

import { DatabaseSQLiteService } from './database-sqlite.service';

describe('DatabaseSQLiteService', () => {
  let service: DatabaseSQLiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseSQLiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
