import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoPotenciaComponent } from './grafico-potencia.component';

describe('GraficoPotenciaComponent', () => {
  let component: GraficoPotenciaComponent;
  let fixture: ComponentFixture<GraficoPotenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoPotenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoPotenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
