import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcherModalComponent } from './searcher-modal.component';

describe('SearcherModalComponent', () => {
  let component: SearcherModalComponent;
  let fixture: ComponentFixture<SearcherModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearcherModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearcherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
