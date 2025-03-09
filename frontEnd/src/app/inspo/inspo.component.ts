import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-inspo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inspo.component.html',
  styleUrl: './inspo.component.css'
})
export class InspoComponent implements OnInit {

  public inspoPhotos: string[] = [];

  constructor(private imageService: ImageService) { }

  // on load, fetch inspo photos from the backend
  ngOnInit() {  
    console.log("InspoComponent: fetching inspirations");
    this.fetchInspoPhotos();
  }

  fetchInspoPhotos() {
    this.imageService.getAllImageUrls().subscribe(
      (imageUrls) => {
        this.inspoPhotos = imageUrls;
        console.log('Fetched images:', this.inspoPhotos);
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }

}
