import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionesInfoComponent } from './sesiones-info.component';

describe('SesionesInfoComponent', () => {
  let component: SesionesInfoComponent;
  let fixture: ComponentFixture<SesionesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionesInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SesionesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
