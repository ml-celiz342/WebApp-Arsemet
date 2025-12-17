import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionesAnaliticasFiltroComponent } from './observaciones-analiticas-filtro.component';

describe('ObservacionesAnaliticasFiltroComponent', () => {
  let component: ObservacionesAnaliticasFiltroComponent;
  let fixture: ComponentFixture<ObservacionesAnaliticasFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservacionesAnaliticasFiltroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservacionesAnaliticasFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
