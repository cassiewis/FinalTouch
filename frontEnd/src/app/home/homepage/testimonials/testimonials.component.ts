import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent implements OnInit, OnDestroy {
    reviews: string[] = [
      '"This is the best service I’ve ever used!" - Customer A',
      '"Amazing quality and fantastic support!" - Customer B',
      '"Highly recommend to anyone looking for great deals. Something way longer to test the height so i hope this works oh i bet it will." - Customer C',
      '"Highly recommend to anyone looking for great deals. Something way longer to test the height so i hope this works oh i bet it will. Highly recommend to anyone looking for great deals. Something way longer to test the height so i hope this works oh i bet it will." - Customer C'
    ];
    currentIndex: number = 0;
    private intervalId!: any;
  
    ngOnInit(): void {
      // Start the automatic carousel
      this.startCarousel();
    }
  
    ngOnDestroy(): void {
      // Clean up the interval when the component is destroyed
      clearInterval(this.intervalId);
    }
  
    startCarousel(): void {
      this.intervalId = setInterval(() => {
        this.showNextReview();
      }, 3000); // Switch every 3 seconds
    }
  
    showNextReview(): void {
      this.currentIndex = (this.currentIndex + 1) % this.reviews.length;
    }
  
    showPreviousReview(): void {
      this.currentIndex = (this.currentIndex - 1 + this.reviews.length) % this.reviews.length;
    }
  
    getTransformStyle(): string {
      return `translateX(-${this.currentIndex * 100}%)`;
    }
}
