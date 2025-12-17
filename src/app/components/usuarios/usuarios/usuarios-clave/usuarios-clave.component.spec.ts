import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosClaveComponent } from './usuarios-clave.component';

describe('UsuariosClaveComponent', () => {
  let component: UsuariosClaveComponent;
  let fixture: ComponentFixture<UsuariosClaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosClaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
