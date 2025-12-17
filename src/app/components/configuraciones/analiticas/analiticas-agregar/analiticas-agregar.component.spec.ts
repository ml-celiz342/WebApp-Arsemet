import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliticasAgregarComponent } from './analiticas-agregar.component';

describe('AnaliticasAgregarComponent', () => {
  let component: AnaliticasAgregarComponent;
  let fixture: ComponentFixture<AnaliticasAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnaliticasAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliticasAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
