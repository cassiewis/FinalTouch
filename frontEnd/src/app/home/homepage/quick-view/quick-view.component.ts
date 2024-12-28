import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-quick-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quick-view.component.html',
  styleUrl: './quick-view.component.css'
})
export class QuickViewComponent {
  product1!: Product;
  product2!: Product;
  product3!: Product;
  products: Product[] = [];

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    // Subscribe to the observable
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
      },
      error => console.error('Error fetching products:', error)
    );

    this.productService.getProduct('custom-mirror-sign-gold').subscribe(
      (product: Product) => {
        this.product1 = product;
      },
      error => console.error('Error fetching product:', error)
    );

    this.productService.getProduct('custom-mirror-sign-black').subscribe(
      (product: Product) => {
        this.product2 = product;
      },
      error => console.error('Error fetching product:', error)
    );

    // this.productService.getProduct('custom-mirror-sign-gold').subscribe(
    //   (product: Product) => {
    //     this.product1 = product;
    //   },
    //   error => console.error('Error fetching product:', error)
    // );
  }
}
