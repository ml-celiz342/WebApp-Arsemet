import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivosAgregarComponent } from './activos-agregar.component';

describe('ActivosAgregarComponent', () => {
  let component: ActivosAgregarComponent;
  let fixture: ComponentFixture<ActivosAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivosAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivosAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
