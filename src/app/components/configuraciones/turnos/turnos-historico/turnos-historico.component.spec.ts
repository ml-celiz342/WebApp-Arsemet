import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosHistoricoComponent } from './turnos-historico.component';

describe('TurnosHistoricoComponent', () => {
  let component: TurnosHistoricoComponent;
  let fixture: ComponentFixture<TurnosHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosHistoricoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
