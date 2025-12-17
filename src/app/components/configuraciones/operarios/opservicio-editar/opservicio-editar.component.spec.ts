import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpservicioEditarComponent } from './opservicio-editar.component';

describe('OpservicioEditarComponent', () => {
  let component: OpservicioEditarComponent;
  let fixture: ComponentFixture<OpservicioEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpservicioEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpservicioEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
