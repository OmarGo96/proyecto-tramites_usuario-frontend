import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateBeforeRenewModalComponent } from './validate-before-renew-modal.component';

describe('ValidateBeforeRenewModalComponent', () => {
  let component: ValidateBeforeRenewModalComponent;
  let fixture: ComponentFixture<ValidateBeforeRenewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateBeforeRenewModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateBeforeRenewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
