import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarCierreComponent } from './confirmar-cierre.component';

describe('ConfirmarCierreComponent', () => {
  let component: ConfirmarCierreComponent;
  let fixture: ComponentFixture<ConfirmarCierreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarCierreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarCierreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
