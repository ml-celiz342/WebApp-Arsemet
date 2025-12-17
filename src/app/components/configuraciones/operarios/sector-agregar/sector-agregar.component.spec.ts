import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorAgregarComponent } from './sector-agregar.component';

describe('SectorAgregarComponent', () => {
  let component: SectorAgregarComponent;
  let fixture: ComponentFixture<SectorAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectorAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectorAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
