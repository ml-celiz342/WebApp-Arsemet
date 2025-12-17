import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoFiltroComponent } from './mantenimiento-filtro.component';

describe('MantenimientoFiltroComponent', () => {
  let component: MantenimientoFiltroComponent;
  let fixture: ComponentFixture<MantenimientoFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoFiltroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
