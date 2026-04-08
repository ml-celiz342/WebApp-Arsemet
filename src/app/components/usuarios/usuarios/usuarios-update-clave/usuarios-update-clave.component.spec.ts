import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosUpdateClaveComponent } from './usuarios-update-clave.component';

describe('UsuariosUpdateClaveComponent', () => {
  let component: UsuariosUpdateClaveComponent;
  let fixture: ComponentFixture<UsuariosUpdateClaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosUpdateClaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosUpdateClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
