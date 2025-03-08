import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  providers: [ProductService], // Add any services you need
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private router: Router) {}

  isBackOfficeRoute(): boolean {
    // Check if the current route is your back office route
    const returnValue = this.router.url.startsWith('/backoffice'); // Adjust the condition based on your route
    // console.log("isBackOfficeRoute: " + returnValue );
    return returnValue;
  }
}
