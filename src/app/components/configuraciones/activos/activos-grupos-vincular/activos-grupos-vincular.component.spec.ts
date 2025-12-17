import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivosGruposVincularComponent } from './activos-grupos-vincular.component';

describe('ActivosGruposVincularComponent', () => {
  let component: ActivosGruposVincularComponent;
  let fixture: ComponentFixture<ActivosGruposVincularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivosGruposVincularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivosGruposVincularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
