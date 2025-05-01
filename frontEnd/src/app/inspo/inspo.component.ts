import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { ImageService } from '../services/image.service';
import { Review } from '../models/review.model';
import { DetailsService } from '../services/details.service';
@Component({
  selector: 'app-inspo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inspo.component.html',
  styleUrl: './inspo.component.css'
})
export class InspoComponent implements OnInit {

  inspoOpen = true;
  inspoPhotos: string[] = [];
  reviews: Review[] = [];

  constructor(private imageService: ImageService, private detailsService: DetailsService) {
    
  }

  // on load, fetch inspo photos from the backend
  ngOnInit() {
    console.log("InspoComponent: fetching inspirations");
    this.fetchInspoPhotos();
  }

  fetchInspoPhotos() {
    this.imageService.getInspoImageUrls().subscribe(
      (imageUrls) => {
        this.inspoPhotos = imageUrls;
        console.log('Fetched images:', this.inspoPhotos);
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }

  fetchReviews() {
    this.detailsService.getAllReviews().subscribe(reviews => {
      this.reviews = reviews;
    });
    console.log("fetched reviews: ", this.reviews);
  }

  togglePage() {
    this.inspoOpen = !this.inspoOpen;
    console.log("InspoComponent: toggling page");

    if (!this.inspoOpen && this.reviews.length === 0) {
      this.fetchReviews();
    }
  }


}