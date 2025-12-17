import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalarmasComponent } from './calarmas.component';

describe('CalarmasComponent', () => {
  let component: CalarmasComponent;
  let fixture: ComponentFixture<CalarmasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalarmasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalarmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
