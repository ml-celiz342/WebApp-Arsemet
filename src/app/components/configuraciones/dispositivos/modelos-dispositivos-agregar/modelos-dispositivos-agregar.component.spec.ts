import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelosDispositivosAgregarComponent } from './modelos-dispositivos-agregar.component';

describe('ModelosDispositivosAgregarComponent', () => {
  let component: ModelosDispositivosAgregarComponent;
  let fixture: ComponentFixture<ModelosDispositivosAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelosDispositivosAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelosDispositivosAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
