import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliticasConfigurarComponent } from './analiticas-configurar.component';

describe('AnaliticasConfigurarComponent', () => {
  let component: AnaliticasConfigurarComponent;
  let fixture: ComponentFixture<AnaliticasConfigurarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnaliticasConfigurarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliticasConfigurarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
