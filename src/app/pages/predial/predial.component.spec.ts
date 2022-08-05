import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredialComponent } from './predial.component';

describe('PredialComponent', () => {
  let component: PredialComponent;
  let fixture: ComponentFixture<PredialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
