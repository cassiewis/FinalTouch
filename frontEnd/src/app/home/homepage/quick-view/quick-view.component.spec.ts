import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickViewComponent } from './quick-view.component';

describe('QuickViewComponent', () => {
  let component: QuickViewComponent;
  let fixture: ComponentFixture<QuickViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
