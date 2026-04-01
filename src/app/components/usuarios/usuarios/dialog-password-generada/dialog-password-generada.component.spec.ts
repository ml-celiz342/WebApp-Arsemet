import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPasswordGeneradaComponent } from './dialog-password-generada.component';

describe('DialogPasswordGeneradaComponent', () => {
  let component: DialogPasswordGeneradaComponent;
  let fixture: ComponentFixture<DialogPasswordGeneradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPasswordGeneradaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPasswordGeneradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
