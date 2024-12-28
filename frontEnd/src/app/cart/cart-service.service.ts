import { Injectable } from '@angular/core';
import { Product } from '../models/product.model'; // Import the Product interface
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  deposit: number;
  datesReserved: Date[];
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0); // Initialize with 0
  cartCount$ = this.cartCountSubject.asObservable(); // Expose the observable for subscribers

  constructor() {
    this.loadCartItems(); // Load items from localStorage when the service is instantiated
    this.updateCartCount(); // Set initial count
  }

  private loadCartItems() {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      this.items = JSON.parse(storedItems);
    }
  }

  getItems(): CartItem[] {
    return this.items;
  }

  getItemCount(): number {
    return this.items.length;
  }

  getTotalCost(): number {
    return this.items.reduce((acc, item) => acc + item.price, 0);
  }

  getTotalDeposit(): number {
    return this.items.reduce((acc, item) => acc + item.deposit, 0);
  }

  addToCart(item: CartItem) {
    this.items.push(item);
    this.saveCartItems(); // Save items to localStorage
    this.updateCartCount(); // Update the cart count
    console.log("CartItem added: dates: " + item.datesReserved);
  }

  removeFromCart(productId: string) {
    this.items = this.items.filter(item => item.productId !== productId);
    this.saveCartItems(); // Save items to localStorage
    this.updateCartCount(); // Update the cart count
  }

  private saveCartItems() {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
  }

  clearCart() {
    this.items = [];
    localStorage.removeItem('cartItems'); // Clear from localStorage
    this.updateCartCount(); // Update the cart count
  }

  private updateCartCount() {
    this.cartCountSubject.next(this.items.length); // Emit the current count to subscribers
  }
}
