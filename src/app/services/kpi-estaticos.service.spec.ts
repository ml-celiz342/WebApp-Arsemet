import { TestBed } from '@angular/core/testing';

import { KpiEstaticosService } from './kpi-estaticos.service';

describe('KpiEstaticosService', () => {
  let service: KpiEstaticosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiEstaticosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
