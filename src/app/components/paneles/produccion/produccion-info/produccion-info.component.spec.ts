import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionInfoComponent } from './produccion-info.component';

describe('ProduccionInfoComponent', () => {
  let component: ProduccionInfoComponent;
  let fixture: ComponentFixture<ProduccionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduccionInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduccionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
