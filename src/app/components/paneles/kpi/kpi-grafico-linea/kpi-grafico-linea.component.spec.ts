import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiGraficoLineaComponent } from './kpi-grafico-linea.component';

describe('KpiGraficoLineaComponent', () => {
  let component: KpiGraficoLineaComponent;
  let fixture: ComponentFixture<KpiGraficoLineaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiGraficoLineaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiGraficoLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
