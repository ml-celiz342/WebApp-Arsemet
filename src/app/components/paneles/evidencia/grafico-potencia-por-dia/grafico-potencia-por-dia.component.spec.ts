import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoPotenciaPorDiaComponent } from './grafico-potencia-por-dia.component';

describe('GraficoPotenciaPorDiaComponent', () => {
  let component: GraficoPotenciaPorDiaComponent;
  let fixture: ComponentFixture<GraficoPotenciaPorDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoPotenciaPorDiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoPotenciaPorDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
