import { TestBed } from '@angular/core/testing';

import { KpiTemporalesService } from './kpi-temporales.service';

describe('KpiTemporalesService', () => {
  let service: KpiTemporalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiTemporalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
