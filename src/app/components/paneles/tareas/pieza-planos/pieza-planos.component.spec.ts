import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiezaPlanosComponent } from './pieza-planos.component';

describe('PiezaPlanosComponent', () => {
  let component: PiezaPlanosComponent;
  let fixture: ComponentFixture<PiezaPlanosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiezaPlanosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiezaPlanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
