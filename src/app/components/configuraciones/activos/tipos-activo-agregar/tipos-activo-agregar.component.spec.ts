import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposActivoAgregarComponent } from './tipos-activo-agregar.component';

describe('TiposActivoAgregarComponent', () => {
  let component: TiposActivoAgregarComponent;
  let fixture: ComponentFixture<TiposActivoAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposActivoAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposActivoAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
