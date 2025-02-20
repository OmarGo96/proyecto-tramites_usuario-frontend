import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribuyenteInfoModalComponent } from './contribuyente-info-modal.component';

describe('ContribuyenteInfoModalComponent', () => {
  let component: ContribuyenteInfoModalComponent;
  let fixture: ComponentFixture<ContribuyenteInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContribuyenteInfoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContribuyenteInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
