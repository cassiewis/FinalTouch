import { Component, Input } from '@angular/core';
import { Reservation } from '../../../models/reservation.model';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReservationService } from '../../../services/reservation.service';

@Component({
  selector: 'app-reservation-box',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './reservation-box.component.html',
  styleUrls: ['./reservation-box.component.css']
})
export class ReservationBoxComponent {
  @Input() reservation!: Reservation;
  expandBox: boolean = false;
  editMode: boolean = false;
  editableReservation!: Reservation; // Editable copy of reservation
  datesForm: FormGroup = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  constructor(private reservationService: ReservationService){}

  ngOnInit() {

    this.editableReservation = { ...this.reservation };
    this.reservation.dates = this.reservation.dates.map(dateStr => new Date(dateStr));
    
    this.datesForm.setValue({
      start: this.editableReservation.dates[0],
      end: this.editableReservation.dates[this.editableReservation.dates.length - 1]
    });
  }

  public openExpandedBox(): void {
    this.expandBox = true;
  }

  closeExpandedBox(): void {
    this.expandBox = false;
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.editableReservation = { ...this.reservation }; // Start editing with a fresh copy
    } else {
      this.cancelChanges(); // Revert changes if exiting edit mode without saving
    }
  }

  openEditMode(){
    this.editMode = true;
  }

  saveChanges(): void {
    // Copy edited values back to the original reservation
    this.reservation = { ...this.editableReservation };

    // Update dates if they were edited in the form
    const formDates = this.datesForm.value;
    if (formDates.start && formDates.end) {
      this.reservation.dates = [new Date(formDates.start), new Date(formDates.end)];
    }

    this.reservationService.updateReservation(this.reservation).subscribe(
      (response: Reservation) => { // Specify the response type
        console.log('Reservation updated successfully:', response);
      },
      (error: any) => { // Specify the error type as any
        console.error('Error updated reservation:', error);
        // error handling logic
      }
    );

    this.editMode = false; // Exit edit mode
    window.location.reload(); // reload the page so reservations update
  }

  cancelChanges(): void {
    // Discard any changes and reset the editable reservation
    this.editableReservation = { ...this.reservation };

    // Reset the form to the original dates
    this.datesForm.setValue({
      start: this.reservation.dates[0],
      end: this.reservation.dates[this.reservation.dates.length - 1]
    });

    this.editMode = false; // Exit edit mode
  }

  displayDates(): string {
    if (this.reservation.dates) {
      const startDate = new Date(this.reservation.dates[0]);
      const endDate = new Date(this.reservation.dates[this.reservation.dates.length-1]);
      const year = startDate.getFullYear();

      // Format each date to only show month (short name) and day
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      const startFormatted = startDate.toLocaleDateString('en-US', options);
      const endFormatted = endDate.getDate(); // Only show the day for the end date

      return `${startFormatted}-${endFormatted}, ${year}`;
    }
    return 'No dates';
  }

  displayDate(date: Date) : string {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const dateFormatted = date.toLocaleDateString('en-US', options);

    return `${dateFormatted}`;
  }

  displayDateFrom(date: Date, days: number) : string {
    if (date) {
      // Create a new Date instance based on the input date to avoid modifying the original date
      const calculatedDate = new Date(date.getTime());
      
      // Adjust the date by the specified number of days
      calculatedDate.setDate(calculatedDate.getDate() + days);
  
      // Format the result to display as desired
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return calculatedDate.toLocaleDateString('en-US', options);
    }
    return "No date";
  }

  displayTotalPrice() : number {
    return this.reservation.items.reduce((total, item) => total + item.price, 0);
  }

  displayTotalDeposit() : number {
    return this.reservation.items.reduce((total, item) => total + item.deposit, 0);
  }
}