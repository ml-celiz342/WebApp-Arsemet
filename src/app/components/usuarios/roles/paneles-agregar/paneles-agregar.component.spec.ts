import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelesAgregarComponent } from './paneles-agregar.component';

describe('PanelesAgregarComponent', () => {
  let component: PanelesAgregarComponent;
  let fixture: ComponentFixture<PanelesAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelesAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelesAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
