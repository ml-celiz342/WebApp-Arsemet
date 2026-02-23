import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasInstanciaGanttComponent } from './tareas-instancia-gantt.component';

describe('TareasInstanciaGanttComponent', () => {
  let component: TareasInstanciaGanttComponent;
  let fixture: ComponentFixture<TareasInstanciaGanttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareasInstanciaGanttComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TareasInstanciaGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
