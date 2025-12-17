import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalarmasEditarNivelComponent } from './calarmas-editar-nivel.component';

describe('CalarmasEditarNivelComponent', () => {
  let component: CalarmasEditarNivelComponent;
  let fixture: ComponentFixture<CalarmasEditarNivelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalarmasEditarNivelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalarmasEditarNivelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
