import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedBookComponent } from './detailed-book.component';

describe('DetailedBookComponent', () => {
  let component: DetailedBookComponent;
  let fixture: ComponentFixture<DetailedBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
