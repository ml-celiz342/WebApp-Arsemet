import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiGraficoTortaComponent } from './kpi-grafico-torta.component';

describe('KpiGraficoTortaComponent', () => {
  let component: KpiGraficoTortaComponent;
  let fixture: ComponentFixture<KpiGraficoTortaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiGraficoTortaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiGraficoTortaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
