import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispositivosAgregarComponent } from './dispositivos-agregar.component';

describe('DispositivosAgregarComponent', () => {
  let component: DispositivosAgregarComponent;
  let fixture: ComponentFixture<DispositivosAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispositivosAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispositivosAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
