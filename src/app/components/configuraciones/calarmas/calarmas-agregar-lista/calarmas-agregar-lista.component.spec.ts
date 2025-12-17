import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalarmasAgregarListaComponent } from './calarmas-agregar-lista.component';

describe('CalarmasAgregarListaComponent', () => {
  let component: CalarmasAgregarListaComponent;
  let fixture: ComponentFixture<CalarmasAgregarListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalarmasAgregarListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalarmasAgregarListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
