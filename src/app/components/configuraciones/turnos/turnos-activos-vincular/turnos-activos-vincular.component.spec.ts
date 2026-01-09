import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosActivosVincularComponent } from './turnos-activos-vincular.component';

describe('TurnosActivosVincularComponent', () => {
  let component: TurnosActivosVincularComponent;
  let fixture: ComponentFixture<TurnosActivosVincularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosActivosVincularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosActivosVincularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
