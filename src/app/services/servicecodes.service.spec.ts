import { TestBed } from '@angular/core/testing';

import { ServicecodesService } from './servicecodes.service';

describe('ServicecodesService', () => {
  let service: ServicecodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicecodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
