import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmasFiltroComponent } from './alarmas-filtro.component';

describe('AlarmasFiltroComponent', () => {
  let component: AlarmasFiltroComponent;
  let fixture: ComponentFixture<AlarmasFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlarmasFiltroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlarmasFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
