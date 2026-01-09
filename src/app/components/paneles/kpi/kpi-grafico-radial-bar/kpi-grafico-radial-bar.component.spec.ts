import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiGraficoRadialBarComponent } from './kpi-grafico-radial-bar.component';

describe('KpiGraficoRadialBarComponent', () => {
  let component: KpiGraficoRadialBarComponent;
  let fixture: ComponentFixture<KpiGraficoRadialBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiGraficoRadialBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiGraficoRadialBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
