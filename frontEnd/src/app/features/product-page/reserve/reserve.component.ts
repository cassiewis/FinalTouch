import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../../cart/cart-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../../shared/custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [CommonModule, JsonPipe, MatDatepickerModule, MatInputModule, MatFormFieldModule, MatNativeDateModule, MatDialogModule, FormsModule, ReactiveFormsModule, CustomSnackbarComponent],
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReserveComponent {
  product!: Product;
  minDate: Date;
  maxDate: Date;
  showReservationPopup: boolean = false;
  isAgreed: boolean = false;
  ItemInCartMessage: string = 'Item already in Cart';
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public dialog: MatDialog,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {
    const today = new Date();
    this.minDate = today;  // Current date
    this.maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());  // 1 year from today
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    if (productId) {

      // Subscribe to the observable
      this.productService.getProduct(productId).subscribe(
        (product: Product) => {
          this.product = product;
        },
        error => console.error('Error fetching product:', error)
      );
    }
  }

// Define the dateFilter function with buffer support
dateFilter = (date: Date | null): boolean => {
  if (!date) {
    console.log("Date is null or undefined. Enabled by default.");
    return true; // Enable if the date is null
  }

  const bufferDays = 4; // Number of buffer days around each reserved date
  // console.log("Checking date:", date);

  // // Check if the current date is within the buffer range of any reserved date
  const isDateDisabled = this.product.datesReserved.some((reservedDate) => {
    // Calculate start and end of buffer period
    const reserved = new Date(reservedDate).getTime();
    const bufferStart = new Date(reservedDate);
    const bufferEnd = new Date(reservedDate);
    bufferStart.setDate(bufferStart.getDate() - bufferDays);
    bufferEnd.setDate(bufferEnd.getDate() + bufferDays);

    console.log("Reserved date:", reservedDate);
    console.log("Buffer period from", bufferStart, "to", bufferEnd);

    // Check if the current date falls within this buffer range
    const isWithinBuffer =
      date.getTime() >= bufferStart.getTime() && date.getTime() <= bufferEnd.getTime();

    if (isWithinBuffer) {
      console.log(
        `Date ${date} is within buffer of reserved date ${reservedDate}. Disabling.`
      );
    }
    return isWithinBuffer;
  });

  console.log(`Date ${date} is ${isDateDisabled ? "disabled" : "enabled"}.`);
  return !isDateDisabled;
};

  isDateRangeValid(): boolean {
    if (this.range.value.start && this.range.value.end) {
      console.log(`start: ${ this.range.value.start }, end: ${ this.range.value.end }`);
      const diffInTime = this.range.value.end.getTime() - this.range.value.start.getTime();
      const diffInDays = (diffInTime / (1000 * 3600 * 24)) + 1;
      return diffInDays <= 5;
    }
    return false;
  }

  onCartClick() {
    if (this.range.invalid) {
      // Create snackbar with error message
      this.snackBar.openFromComponent(CustomSnackbarComponent, {
        data: {
          message: `Your selected dates are not avaliable.<br>Open calendar icon to see avaliable dates`,
          action: () => {}, // No action needed
          actionLabel: 'Close'
        },
        duration: 5000,
        panelClass: 'custom-snackbar'
      }); 
      return;
    }
    if (this.isDateRangeValid()) {
      const startDate = this.range.value.start;
      const endDate = this.range.value.end;
  
      if (startDate && endDate) {
        const currentDatesReserved: Date[] = [];
        const currentDate = new Date(startDate);
  
        // Loop through each day from start to end date
        while (currentDate <= endDate) {
          currentDatesReserved.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
  
        const cartItem = {
          productId: this.product.productId,
          name: this.product.name,
          price: this.product.price,
          deposit: this.product.deposit,
          datesReserved: currentDatesReserved,
          imageUrl: this.product.imageUrl
        };
  
        const existingItems = this.cartService.getItems();
        const isItemInCart = existingItems.some(item => item.productId === cartItem.productId);
  
        if (!isItemInCart) {
          this.cartService.addToCart(cartItem);
  
          // Create snackbar with item details
          this.snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {
              message: `${cartItem.name} added to your cart!`,
              action: () => this.router.navigate(['/cart']),
              actionLabel: 'Go to Cart'
            },
            duration: 5000,
            panelClass: 'custom-snackbar'
          });
        } else {
          // Create snackbar with item details
          const message = 'Item already in cart.<br>If you want to reserve this item for separate dates,<br>please submit a separate reservation.';
          
          this.snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {
              message: message,
              action: () => {}, // No action needed
              actionLabel: 'Close'
            },
            duration: 5000,
            panelClass: 'custom-snackbar'
          });
        }
      }
    } else {
      // Create snackbar with item details
      this.snackBar.openFromComponent(CustomSnackbarComponent, {
        data: {
          message: `Please select a valid date range.<br>5 days max.`,
          action: () => this.router.navigate(['/cart']),
          actionLabel: 'Close'
        },
        duration: 5000,
        panelClass: 'custom-snackbar'
      });
    }
  }
  
}
