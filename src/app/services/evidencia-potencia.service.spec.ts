import { TestBed } from '@angular/core/testing';

import { EvidenciaPotenciaService } from './evidencia-potencia.service';

describe('EvidenciaPotenciaService', () => {
  let service: EvidenciaPotenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvidenciaPotenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
