import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpejecucionFiltroComponent } from './opejecucion-filtro.component';

describe('OpejecucionFiltroComponent', () => {
  let component: OpejecucionFiltroComponent;
  let fixture: ComponentFixture<OpejecucionFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpejecucionFiltroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpejecucionFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
