import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAddProductComponent } from '../admin-shared/admin-add-product/admin-add-product.component';
import { Product } from '../../models/product.model';
import { AdminProductBoxComponent } from '../admin-shared/admin-product-box/admin-product-box.component';
// import { ProductService } from '../../services/product.service';
import { AdminProductService } from '../admin-services/admin-product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, AdminAddProductComponent, AdminProductBoxComponent],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent {
products: Product[] = [];
  loading: boolean = true;
  activeProducts: Product[] = [];
  inactiveProducts: Product[] = [];

  constructor(private adminProductService: AdminProductService){}

  ngOnInit() {
    
    this.adminProductService.getAdminProducts().subscribe(products => {
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
    this.adminProductService.fetchAdminProducts().subscribe(
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
