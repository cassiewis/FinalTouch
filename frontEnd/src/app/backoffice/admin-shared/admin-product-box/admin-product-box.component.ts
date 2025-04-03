import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { AdminProductService } from '../../admin-services/admin-product.service';

@Component({
  selector: 'app-admin-product-box',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatNativeDateModule, MatIconModule],
  templateUrl: './admin-product-box.component.html',
  styleUrl: './admin-product-box.component.css'
})
export class AdminProductBoxComponent {
  @Input() product!: Product;
  @Input() numReservations!: number;

  editMode: boolean = false;
  editableProduct!: Product;
  showCalendar: boolean = false;

  constructor(
    private productService: ProductService,
    private adminProductService: AdminProductService
  ){}

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  dateClass = (date: Date): string => {
    if (!this.product.datesReserved || this.product.datesReserved.length === 0) return '';
  
    // Convert string dates from product.datesReserved to Date objects
    const reservedDates = this.product.datesReserved.map(d => new Date(d));
  
    // Check if the current date is in the reserved dates array
    const isReserved = reservedDates.some(d => d.toDateString() === date.toDateString());
    
    // Log to check if dates are being compared properly
    if (isReserved) console.log('Reserved: ', date);

    // Apply the reserved-date class if the date is reserved
    if (isReserved) return 'reserved-date';
    return '';
  };

  // dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
  //   // Only highligh dates inside the month view.
  //   if (view === 'month') {
  //     const date = cellDate.getDate();

  //     // Highlight the 1st and 20th day of each month.
  //     return date === 1 || date === 20 ? 'example-custom-date-class' : '';
  //   }

  //   return '';
  // };



  openProductEditor() {
    this.editableProduct = { ...this.product }; // Create a copy of the product
    this.editMode = true;
  }

  saveProduct() {
    // Update the product with edited values
    this.product = { ...this.editableProduct };

    this.adminProductService.updateProduct(this.product).subscribe(
      (response: Product) => { // Specify the response type
        console.log('Product updated successfully:', response);
      },
      (error: any) => { // Specify the error type as any
        console.error('Error updated product:', error);
        // error handling logic
      }
    );
    
    this.editMode = false;
    console.log('Product saved:', this.product);
  }

  closeProductEditor() {
    this.editMode = false;
  }

  deleteProduct() {
    // open verification dialog
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      this.adminProductService.deleteProduct(this.product.productId).subscribe(
        () => {
          console.log('Product deleted:', this.product.productId);
          // Remove the product from the list
          // this.products = this.products.filter(p => p.productId !== this.product.productId);
        },
        (error: any) => {
          console.error('Error deleting product:', error);
          // error handling logic
        }
      );
    }
  }
}
