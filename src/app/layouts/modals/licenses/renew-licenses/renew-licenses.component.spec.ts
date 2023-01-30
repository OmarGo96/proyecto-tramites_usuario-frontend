import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewLicensesComponent } from './renew-licenses.component';

describe('RenewLicensesComponent', () => {
  let component: RenewLicensesComponent;
  let fixture: ComponentFixture<RenewLicensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewLicensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewLicensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
