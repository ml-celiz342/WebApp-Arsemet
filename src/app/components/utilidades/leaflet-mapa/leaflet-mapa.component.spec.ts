import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafletMapaComponent } from './leaflet-mapa.component';

describe('LeafletMapaComponent', () => {
  let component: LeafletMapaComponent;
  let fixture: ComponentFixture<LeafletMapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeafletMapaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeafletMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
