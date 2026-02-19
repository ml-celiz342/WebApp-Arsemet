import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciaTablaComponent } from './evidencia-tabla.component';

describe('EvidenciaTablaComponent', () => {
  let component: EvidenciaTablaComponent;
  let fixture: ComponentFixture<EvidenciaTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvidenciaTablaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenciaTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
