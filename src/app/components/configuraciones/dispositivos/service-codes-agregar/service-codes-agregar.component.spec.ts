import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCodesAgregarComponent } from './service-codes-agregar.component';

describe('ServiceCodesAgregarComponent', () => {
  let component: ServiceCodesAgregarComponent;
  let fixture: ComponentFixture<ServiceCodesAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCodesAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCodesAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
