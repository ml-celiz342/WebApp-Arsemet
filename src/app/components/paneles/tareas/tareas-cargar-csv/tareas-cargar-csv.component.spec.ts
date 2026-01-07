import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasCargarCsvComponent } from './tareas-cargar-csv.component';

describe('TareasCargarCsvComponent', () => {
  let component: TareasCargarCsvComponent;
  let fixture: ComponentFixture<TareasCargarCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareasCargarCsvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TareasCargarCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
