import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCuentaModalComponent } from './estado-cuenta-modal.component';

describe('EstadoCuentaModalComponent', () => {
  let component: EstadoCuentaModalComponent;
  let fixture: ComponentFixture<EstadoCuentaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoCuentaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoCuentaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
