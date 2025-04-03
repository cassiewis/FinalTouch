import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HttpClientModule,
    HeaderComponent,
    FooterComponent
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
    return returnValue;
  }
}
