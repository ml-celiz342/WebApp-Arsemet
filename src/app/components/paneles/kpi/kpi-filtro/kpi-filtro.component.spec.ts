import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiFiltroComponent } from './kpi-filtro.component';

describe('KpiFiltroComponent', () => {
  let component: KpiFiltroComponent;
  let fixture: ComponentFixture<KpiFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiFiltroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
