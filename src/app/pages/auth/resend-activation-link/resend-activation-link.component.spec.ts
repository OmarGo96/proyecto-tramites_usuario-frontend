import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendActivationLinkComponent } from './resend-activation-link.component';

describe('ResendActivationLinkComponent', () => {
  let component: ResendActivationLinkComponent;
  let fixture: ComponentFixture<ResendActivationLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendActivationLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendActivationLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
