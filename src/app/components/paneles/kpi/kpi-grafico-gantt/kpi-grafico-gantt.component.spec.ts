import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiGraficoGanttComponent } from './kpi-grafico-gantt.component';

describe('KpiGraficoGanttComponent', () => {
  let component: KpiGraficoGanttComponent;
  let fixture: ComponentFixture<KpiGraficoGanttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiGraficoGanttComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiGraficoGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
