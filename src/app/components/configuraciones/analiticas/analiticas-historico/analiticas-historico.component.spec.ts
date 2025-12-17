import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliticasHistoricoComponent } from './analiticas-historico.component';

describe('AnaliticasHistoricoComponent', () => {
  let component: AnaliticasHistoricoComponent;
  let fixture: ComponentFixture<AnaliticasHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnaliticasHistoricoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliticasHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
