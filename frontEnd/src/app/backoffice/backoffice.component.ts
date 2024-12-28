import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { ProductService } from '../services/product.service';
import { ReservationService } from '../services/reservation.service';
import { Product } from '../models/product.model';
import { Reservation } from '../models/reservation.model';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css'],
  imports: [RouterModule],
  standalone: true,
})
export class BackofficeComponent implements OnInit {
  public products: Product[] = [];
  public reservations: Reservation[] = [];

  constructor(
    private productService: ProductService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    // make sure products are up to date
    // this.productService.fetchProducts();
  
  }
}
