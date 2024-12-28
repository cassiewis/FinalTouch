import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationBoxComponent } from './reservation-box.component';

describe('ReservationBoxComponent', () => {
  let component: ReservationBoxComponent;
  let fixture: ComponentFixture<ReservationBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
