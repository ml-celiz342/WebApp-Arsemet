import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalarmasCrearOrigenComponent } from './calarmas-crear-origen.component';

describe('CalarmasCrearOrigenComponent', () => {
  let component: CalarmasCrearOrigenComponent;
  let fixture: ComponentFixture<CalarmasCrearOrigenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalarmasCrearOrigenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalarmasCrearOrigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
