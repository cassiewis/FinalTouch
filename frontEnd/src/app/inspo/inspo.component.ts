import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-inspo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inspo.component.html',
  styleUrl: './inspo.component.css'
})
export class InspoComponent implements OnInit {

  // public String[] inspoPhotos = [];
  // constructor(private ) { }

  // on load, fetch inspo photos from the backend
  ngOnInit() {  
    console.log("InspoComponent: fetching inspirations");

  }

}
