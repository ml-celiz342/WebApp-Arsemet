import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoGenericoComponent } from './grafico-generico.component';

describe('GraficoGenericoComponent', () => {
  let component: GraficoGenericoComponent;
  let fixture: ComponentFixture<GraficoGenericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoGenericoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
