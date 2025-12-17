import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciaFiltroComponent } from './evidencia-filtro.component';

describe('EvidenciaFiltroComponent', () => {
  let component: EvidenciaFiltroComponent;
  let fixture: ComponentFixture<EvidenciaFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvidenciaFiltroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenciaFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
