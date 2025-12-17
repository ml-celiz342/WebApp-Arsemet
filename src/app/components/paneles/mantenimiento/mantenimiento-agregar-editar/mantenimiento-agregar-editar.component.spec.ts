import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoAgregarEditarComponent } from './mantenimiento-agregar-editar.component';

describe('MantenimientoAgregarEditarComponent', () => {
  let component: MantenimientoAgregarEditarComponent;
  let fixture: ComponentFixture<MantenimientoAgregarEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoAgregarEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoAgregarEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
