import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescansosAgregarComponent } from './descansos-agregar.component';

describe('DescansosAgregarComponent', () => {
  let component: DescansosAgregarComponent;
  let fixture: ComponentFixture<DescansosAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescansosAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescansosAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
