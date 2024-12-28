import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from "./product-list/product-list.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  standalone: true, 
  imports: [CommonModule, ProductListComponent, HttpClientModule], // Import the ProductComponent
  providers: [], // Provide the ProductService

})
export class ShopComponent implements OnInit {

  ngOnInit(){
    
  }
}
