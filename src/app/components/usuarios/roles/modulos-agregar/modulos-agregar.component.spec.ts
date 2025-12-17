import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulosAgregarComponent } from './modulos-agregar.component';

describe('ModulosAgregarComponent', () => {
  let component: ModulosAgregarComponent;
  let fixture: ComponentFixture<ModulosAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulosAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulosAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
