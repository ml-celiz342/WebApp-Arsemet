import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoConfirmarComponent } from './dialogo-confirmar.component';

describe('DialogoConfirmarComponent', () => {
  let component: DialogoConfirmarComponent;
  let fixture: ComponentFixture<DialogoConfirmarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoConfirmarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoConfirmarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
