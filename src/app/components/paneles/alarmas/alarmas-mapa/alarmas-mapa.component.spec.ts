import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmasMapaComponent } from './alarmas-mapa.component';

describe('AlarmasMapaComponent', () => {
  let component: AlarmasMapaComponent;
  let fixture: ComponentFixture<AlarmasMapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlarmasMapaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlarmasMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
