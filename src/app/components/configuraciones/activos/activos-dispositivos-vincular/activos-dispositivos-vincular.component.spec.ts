import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivosDispositivosVincularComponent } from './activos-dispositivos-vincular.component';

describe('ActivosDispositivosVincularComponent', () => {
  let component: ActivosDispositivosVincularComponent;
  let fixture: ComponentFixture<ActivosDispositivosVincularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivosDispositivosVincularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivosDispositivosVincularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
