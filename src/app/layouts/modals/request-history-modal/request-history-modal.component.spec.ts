import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestHistoryModalComponent } from './request-history-modal.component';

describe('RequestHistoryModalComponent', () => {
  let component: RequestHistoryModalComponent;
  let fixture: ComponentFixture<RequestHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
