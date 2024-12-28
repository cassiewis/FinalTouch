import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from "../shared/add-product/add-product.component";
import { Product } from '../../models/product.model';
import { ProductBoxComponent } from '../shared/product-box/product-box.component';
import { ProductService } from '../../services/product.service';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, AddProductComponent, ProductBoxComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  activeProducts: Product[] = [];
  inactiveProducts: Product[] = [];

  constructor(private productService: ProductService){}

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
  
      // Filter products into active and inactive categories
      this.activeProducts = this.products.filter(product => product.active);
      this.inactiveProducts = this.products.filter(product => !product.active);
  
      // Log after filtering is complete
      console.log("Active Products: ", this.activeProducts);
      console.log("Inactive Products: ", this.inactiveProducts);
  
      this.loading = false; // Set loading to false only after filtering
    });
  }

  refreshProducts(): void {
    console.log("refreshed");
    this.productService.fetchProducts().subscribe(
      (products: Product[]) => {
        console.log("Products refreshed:", products);
        this.products = products;
        // this.filteredProducts = [...this.products]; // Update filtered list
      },
      (error) => {
        console.error("Error refreshing products:", error);
      }
    );
  }
}
