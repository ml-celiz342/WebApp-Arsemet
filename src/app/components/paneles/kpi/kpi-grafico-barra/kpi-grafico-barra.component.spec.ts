import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiGraficoBarraComponent } from './kpi-grafico-barra.component';

describe('KpiGraficoBarraComponent', () => {
  let component: KpiGraficoBarraComponent;
  let fixture: ComponentFixture<KpiGraficoBarraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiGraficoBarraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiGraficoBarraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
