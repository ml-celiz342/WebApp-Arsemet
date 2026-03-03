import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasGraficoGanttComponent } from './tareas-grafico-gantt.component';

describe('TareasGraficoGanttComponent', () => {
  let component: TareasGraficoGanttComponent;
  let fixture: ComponentFixture<TareasGraficoGanttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareasGraficoGanttComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TareasGraficoGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
