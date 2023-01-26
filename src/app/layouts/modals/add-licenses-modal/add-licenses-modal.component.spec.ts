import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLicensesModalComponent } from './add-licenses-modal.component';

describe('AddLicensesModalComponent', () => {
  let component: AddLicensesModalComponent;
  let fixture: ComponentFixture<AddLicensesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLicensesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLicensesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
