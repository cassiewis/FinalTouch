import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-box',
  standalone: true,
  imports: [],
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.css'
})
export class ProductBoxComponent {
  @Input() product!: Product; // Accept product data as input

  constructor(private router: Router) {}

  goToProductPage(): void {
    this.router.navigate(['/product', this.product.productId]); // Navigate to product detail page
  }
}
