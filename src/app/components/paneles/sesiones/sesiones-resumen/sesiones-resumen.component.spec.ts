import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionesResumenComponent } from './sesiones-resumen.component';

describe('SesionesResumenComponent', () => {
  let component: SesionesResumenComponent;
  let fixture: ComponentFixture<SesionesResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionesResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SesionesResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
