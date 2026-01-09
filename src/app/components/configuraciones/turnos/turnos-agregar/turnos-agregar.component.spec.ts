import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosAgregarComponent } from './turnos-agregar.component';

describe('TurnosAgregarComponent', () => {
  let component: TurnosAgregarComponent;
  let fixture: ComponentFixture<TurnosAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
