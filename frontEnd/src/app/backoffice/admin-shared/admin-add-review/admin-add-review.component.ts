import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // for date picker functionality
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Review } from '../../../models/review.model';
import { DetailsService } from '../../../services/details.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminDetailsService } from '../../admin-services/admin-details.service';

@Component({
  selector: 'app-admin-add-review',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatCheckboxModule, 
    MatButtonModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    ReactiveFormsModule
  ],
  templateUrl: './admin-add-review.component.html',
  styleUrl: './admin-add-review.component.css'
})
export class AdminAddReviewComponent {
  popupOpen: boolean = false;
  review: Review = {
    id: '',
    author: '',
    content: '',
    rating: 0,
    event: '',
    date: ''
  }
  imageUrlAutoGenerated: boolean = true;

  constructor(
    private detailsService: DetailsService,
    private snackBar: MatSnackBar,
    private adminDetailsService: AdminDetailsService
  ){}


  openReviewCreator() {
    this.popupOpen = true;
  }

  closeReviewCreator() {
    this.popupOpen = false;
  }

  createReview() {
    const generatedstring = Math.random().toString(36).substring(2, 10);
    this.review.id = this.review.author + "-" + generatedstring;

    console.log("Trying to add review: " + this.review);

    this.adminDetailsService.addReview(this.review).subscribe(
      (response: Review) => {
        console.log('Review added successfully:', response);
        this.closeReviewCreator();
        window.location.reload();
      },
      (error: any) => {
        console.error('Error adding review:', error);
        this.displayError(error);
      }
    );

  }

  displayError(error: any): void {
    let errorMessage = 'An error occurred while creating your review.';

    // Customize the error message based on the error response if available
    if (error && error.message) {
      errorMessage = error.message;
    }

    // Display the error message using Snackbar
    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,  // The snackbar will automatically close after 5 seconds
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

}
