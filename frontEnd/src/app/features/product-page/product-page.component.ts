import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Location } from '@angular/common';
import { CartService } from '../../cart/cart-service.service';
import { ReserveComponent } from './reserve/reserve.component';
import { LoadingIconComponent } from '../../shared/loading-icon/loading-icon.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
  standalone: true,
  imports: [ReserveComponent, CommonModule, LoadingIconComponent, HeaderComponent, FooterComponent],
})
export class ProductPageComponent implements OnInit {
  product!: Product; // Assert that Product will always be defined
  productId: string | null = null; // Hold the current productId
  loading: boolean = true; // Add loading state


  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService,
    private location: Location,
    private router: Router,
    private cartService: CartService
  ) {
  }

  ngOnInit(): void {

    // Get the productId from the current URL
    this.productId = this.route.snapshot.paramMap.get('productId');

    // Subscribe to the observable
    if (this.productId){
      this.productService.getProduct(this.productId).subscribe(
        (product: Product) => {
          this.product = product;
          this.loading = false; 
        },
        error => console.error('Error fetching product:', error)
      );
    } else {
      console.log("Cannot find ProductId");
      this.router.navigate(['/notFound']);
    }

    // Scroll to the top on page load
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    
    console.log('productpage loaded');
  }

  goBack(): void {
    this.location.back(); 
  }
}
