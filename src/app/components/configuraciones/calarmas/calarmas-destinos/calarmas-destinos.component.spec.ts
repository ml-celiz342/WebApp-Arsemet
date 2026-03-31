import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalarmasDestinosComponent } from './calarmas-destinos.component';

describe('CalarmasDestinosComponent', () => {
  let component: CalarmasDestinosComponent;
  let fixture: ComponentFixture<CalarmasDestinosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalarmasDestinosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalarmasDestinosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
