import { Component, ViewChild, ViewChildren, QueryList, OnInit } from '@angular/core';
import { CartService, CartItem } from '../cart-service.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckoutPopupComponent } from './checkout-popup/checkout-popup.component';
import { ProductService } from '../../services/product.service';
import { CartItemComponent } from '../cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, CheckoutPopupComponent, CartItemComponent]
})
export class CartComponent implements OnInit{
  cartItems: CartItem[] = [];
  totalCost: number = 0;
  totalDeposit: number = 0;

  @ViewChild(CheckoutPopupComponent) popupComponent!: CheckoutPopupComponent;
  @ViewChildren(CartItemComponent) cartItemComponents!: QueryList<CartItemComponent>;

  constructor(private cartService: CartService, private router: Router, private productService: ProductService) {
    this.cartItems = this.cartService.getItems();
    this.totalCost = this.cartService.getTotalCost();
    this.totalDeposit = this.cartService.getTotalDeposit();
    console.log('total cart items: ' + this.cartItems.length);
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.checkValidDatesForItems();
  }

  public updateCart() {
    console.log("cart updated.")
    this.cartItems = this.cartService.getItems();
    this.totalCost = this.cartService.getTotalCost();
    this.totalDeposit = this.cartService.getTotalDeposit();
    }

  goShop() {
    this.router.navigate(['/shop']);
  }

  showPopup() {
    if (this.popupComponent) {
      this.popupComponent.showPopup();
    }
  }

  checkValidDatesForItems() {
    const bufferDates = 5; // Set your buffer days here
    console.log(`total cart items: ${ this.cartItems.length }`);
    this.cartItemComponents.forEach(itemComponent => {
      itemComponent.checkValidDates(bufferDates); // Call the method on each CartItemComponent
    });
  }

}
