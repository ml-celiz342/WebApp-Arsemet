import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperarioAgregarComponent } from './operario-agregar.component';

describe('OperarioAgregarComponent', () => {
  let component: OperarioAgregarComponent;
  let fixture: ComponentFixture<OperarioAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperarioAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperarioAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
