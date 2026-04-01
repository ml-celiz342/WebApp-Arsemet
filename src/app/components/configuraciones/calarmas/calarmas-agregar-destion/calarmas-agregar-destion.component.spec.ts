import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalarmasAgregarDestionComponent } from './calarmas-agregar-destion.component';

describe('CalarmasAgregarDestionComponent', () => {
  let component: CalarmasAgregarDestionComponent;
  let fixture: ComponentFixture<CalarmasAgregarDestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalarmasAgregarDestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalarmasAgregarDestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
