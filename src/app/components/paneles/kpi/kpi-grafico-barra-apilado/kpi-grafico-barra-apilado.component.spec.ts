import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiGraficoBarraApiladoComponent } from './kpi-grafico-barra-apilado.component';

describe('KpiGraficoBarraApiladoComponent', () => {
  let component: KpiGraficoBarraApiladoComponent;
  let fixture: ComponentFixture<KpiGraficoBarraApiladoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiGraficoBarraApiladoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiGraficoBarraApiladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
