import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Location } from '@angular/common';
import { CartService } from '../../cart/cart-service.service';
import { ReserveComponent } from './reserve/reserve.component';
import { LoadingIconComponent } from '../../shared/loading-icon/loading-icon.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
  standalone: true,
  imports: [ReserveComponent, CommonModule, LoadingIconComponent],
})
export class ProductPageComponent implements OnInit {
  product!: Product; // Assert that Product will always be defined
  productId: string | null = null; // Hold the current productId
  loading: boolean = true; // Add loading state
  isPolicyOpen = false;
  isCustomOpen = false;

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
    if (this.productId) {
      console.log("Checking if product exists...");
      this.productService.getProduct(this.productId).pipe(
        catchError(error => {
          console.log('Error fetching product. Rerouting to 404');
          this.router.navigate(['/notFound']); // Navigate to the notFound page
          return of(null); // Return an empty observable to complete the stream
        })
      ).subscribe(
        (product: Product | null) => {
          if (product) {
            this.product = product;
            this.loading = false;
          }
        }
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

  toggleReturnPolicy() {
    this.isPolicyOpen = !this.isPolicyOpen;
  }

  toggleCustomBox() {
    this.isCustomOpen = !this.isCustomOpen;
  }
}
