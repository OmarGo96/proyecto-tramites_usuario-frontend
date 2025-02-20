import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatePaoRenewModalComponent } from './validate-pao-renew-modal.component';

describe('ValidatePaoRenewModalComponent', () => {
  let component: ValidatePaoRenewModalComponent;
  let fixture: ComponentFixture<ValidatePaoRenewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatePaoRenewModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidatePaoRenewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
