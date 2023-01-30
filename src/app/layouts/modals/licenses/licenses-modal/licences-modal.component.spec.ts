import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicencesModalComponent } from './licences-modal.component';

describe('LicencesModalComponent', () => {
  let component: LicencesModalComponent;
  let fixture: ComponentFixture<LicencesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicencesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicencesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
