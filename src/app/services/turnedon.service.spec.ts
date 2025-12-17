import { TestBed } from '@angular/core/testing';

import { TurnedonService } from './turnedon.service';

describe('TurnedonService', () => {
  let service: TurnedonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurnedonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
