import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CartItem } from '../cart-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart-service.service';
import { CartComponent } from '../cart-page/cart-page.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, CartComponent],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent implements OnInit {
  @Input() item!: CartItem; // Accept product data as input
  hasDateErrors: boolean;
  currentProduct!: Product;
  
  @Output("updateCart") updateCart: EventEmitter<any> = new EventEmitter(); // EventEmitter to notify CartComponent

  constructor(private router: Router, private cartService: CartService, private productService: ProductService){
    this.hasDateErrors = false;
  }

  ngOnInit() {
   // Subscribe to the observable
    this.productService.getProduct(this.item.productId).subscribe(
      (product: Product) => {
        this.currentProduct = product;
      },
      error => console.error('Error fetching product:', error)
    );
    
  }

  routeToProduct() {
    this.router.navigate(['/product/' + this.item.productId]);
  }

  checkValidDates(bufferDates: number) {
    
    if (this.currentProduct) {
      this.hasDateErrors = false;
  
      // for (const dateReserved of this.item.datesReserved) {
      //   const isDateRestricted = this.currentProduct.datesReserved.some(reservedDate => {
      //     const reservedTimestamp = new Date(reservedDate).getTime();
      //     const dateReservedTimestamp = new Date(dateReserved).getTime();
      //     const buffer = 5 * 24 * 60 * 60 * 1000;
  
      //     return (
      //       dateReservedTimestamp >= reservedTimestamp - buffer &&
      //       dateReservedTimestamp <= reservedTimestamp + buffer
      //     );
      //   });
  
        // if (isDateRestricted) {
        //   setTimeout(() => {
        //     this.hasDateErrors = true;
        //     console.log(`Date ${dateReserved} is within the restricted range for product ${this.item.productId}`);
        //   });
        //   break; // Exit the loop if a conflict is found
        // } else {
        //   console.log(`Date ${dateReserved} is available for product ${this.item.productId}`);
        // }
      // }
    } else {
      console.log(`Product not found.`);
    }
  }
  
  formatDateRange(datesReserved: Date[]): string {
    if (datesReserved.length === 0) {
      console.log("No dates reserved for cart item");
      return 'No dates reserved';
    }  
    const startDate = new Date(datesReserved[0]).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    });
    const endDate = new Date(datesReserved[datesReserved.length - 1]).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    });
    return `${startDate} - ${endDate}`;
  }

  removeItem() {
    this.cartService.removeFromCart(this.item.productId);
    this.updateCart.emit('something');
  }
}

