import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasFiltroComponent } from './tareas-filtro.component';

describe('TareasFiltroComponent', () => {
  let component: TareasFiltroComponent;
  let fixture: ComponentFixture<TareasFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareasFiltroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TareasFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
