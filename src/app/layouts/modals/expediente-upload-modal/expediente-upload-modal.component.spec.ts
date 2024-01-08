import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedienteUploadModalComponent } from './expediente-upload-modal.component';

describe('ExpedienteUploadModalComponent', () => {
  let component: ExpedienteUploadModalComponent;
  let fixture: ComponentFixture<ExpedienteUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedienteUploadModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpedienteUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
