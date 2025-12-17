import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispositivosAnaliticasVincularComponent } from './dispositivos-analiticas-vincular.component';

describe('DispositivosAnaliticasVincularComponent', () => {
  let component: DispositivosAnaliticasVincularComponent;
  let fixture: ComponentFixture<DispositivosAnaliticasVincularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispositivosAnaliticasVincularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispositivosAnaliticasVincularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
