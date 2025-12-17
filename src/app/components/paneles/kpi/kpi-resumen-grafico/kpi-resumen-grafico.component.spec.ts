import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiResumenGraficoComponent } from './kpi-resumen-grafico.component';

describe('KpiResumenGraficoComponent', () => {
  let component: KpiResumenGraficoComponent;
  let fixture: ComponentFixture<KpiResumenGraficoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiResumenGraficoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiResumenGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
