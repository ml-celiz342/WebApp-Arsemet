import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiPasosComponent } from './kpi-pasos.component';

describe('KpiPasosComponent', () => {
  let component: KpiPasosComponent;
  let fixture: ComponentFixture<KpiPasosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiPasosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiPasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
