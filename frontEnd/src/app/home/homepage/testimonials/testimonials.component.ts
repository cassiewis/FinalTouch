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
    reviews: Review[] = [
      new Review('John Doe', 'This service was amazing! Highly recommend going with final touch for your next event. She delivered in a timely fashion and always love seeing someone so dedicated to weddings!! Love love love!', 5),
      new Review('Jane Smith', 'Absolutely loved the experience!', 4),
      new Review('Alice Johnson', 'Will definitely use this service again.', 5),
      new Review('Bob Brown', 'Not what I expected, but still okay.', 3),
      new Review('Jane Smith', 'Absolutely loved the experience!', 4),
      new Review('Alice Johnson', 'Will definitely use this service again.', 5)
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

class Review {
  author: string;
  content: string;
  stars: number;

  constructor(author: string, content: string, stars: number) {
    this.author = author;
    this.content = content;
    this.stars = stars;
  }
}