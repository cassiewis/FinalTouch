import { Component, AfterViewInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { Options } from '@angular-slider/ngx-slider';
import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [NgxSliderModule, MatSliderModule, CommonModule, FormsModule, RouterModule, ProductListComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements AfterViewInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  selectedFilters: string[] = [];
  searchQuery: string = '';
  minPrice: number = 0;
  maxPrice: number = 100;

  loading: boolean = true;

  showMobileFilter: boolean = false;
  isSmallScreen: boolean = false;
  productsPerPage: number = 12;
  currentPage: number = 0;
  
  typeCategory: string[] = ['Signage', 'Table Numbers', 'Florals', 'Lighting', 'Tableware'];
  colorCategory: string[] = ['White', 'Black', 'Gold', 'Silver', 'Clear', 'Brown', 'Blue', 'Green', 'Pink', 'Purple', 'Red', 'Yellow', 'Orange'];
  eventCategory: string[] = ['Wedding', 'Baby Shower', 'Engagement', 'Bridal Shower', 'Birthday'];
  customSelection = 'Any';

  openSections: { [key: string]: boolean } = {
    type: true,
    color: false,
    price: false,
    event: false,
    custom: false
  };

  priceSliderOptions: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
    animate: true,
    showTicks: false,
    showTicksValues: false,
    translate: () => ''  // This hides the labels above the slider handles
  };

  @ViewChild('filterBox') filterBox!: ElementRef;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['filters']) {
        this.selectedFilters = params['filters'].split(',');
      }
    });

    this.productService.fetchProducts().subscribe(products => {
      this.products = products;
      this.applyAllFilters();
      this.loading = false;
    });

    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));

  }

  ngAfterViewInit() {
    this.selectedFilters.forEach(filter => {
      const checkbox = Array.from(document.querySelectorAll('input[type="checkbox"]')).find(
        input => (input as HTMLInputElement).value.toLowerCase().trim() === filter.toLowerCase().trim()
      ) as HTMLInputElement;

      if (checkbox) {
        checkbox.checked = true;
      }
    });
  }

  get pagedProducts(): Product[] {
    const start = this.currentPage * this.productsPerPage;
    return this.filteredProducts.slice(start, start + this.productsPerPage);
  }
  
  setPage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.productsPerPage);
  }
  
  totalPagesArray(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i);
  }

  get totalProducts(): number {
    return this.filteredProducts.length;
  }
  
  get startIndex(): number {
    return this.currentPage * this.productsPerPage + 1;
  }
  
  get endIndex(): number {
    const end = this.startIndex + this.pagedProducts.length - 1;
    return end > this.totalProducts ? this.totalProducts : end;
  }

  toggleMobileFilter() {
    this.showMobileFilter = !this.showMobileFilter;
  }

  closeFilter() {
    this.showMobileFilter = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.showMobileFilter &&
      this.filterBox &&
      !this.filterBox.nativeElement.contains(event.target)
    ) {
      this.closeFilter();
    }
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 630;
    if (!this.isSmallScreen) {
      this.showMobileFilter = false;
    }
  }

  toggleSection(section: string): void {
    this.openSections[section] = !this.openSections[section];
  }

  toggleFilter(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      this.selectedFilters.push(value);
    } else {
      this.selectedFilters = this.selectedFilters.filter(f => f !== value);
    }

    this.updateURLFilters();
    this.applyAllFilters();
  }

  updateCustom(custom: string) {
    this.customSelection = custom;
    this.updateURLFilters();
    this.applyAllFilters();
  }

  updateURLFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        filters: this.selectedFilters.join(',')
      },
      queryParamsHandling: 'merge'
    });
  }

  applyAllFilters(): void {
    const search = this.searchQuery.toLowerCase();
    const groupedFilters: { [key: string]: string[] } = {
      type: [],
      color: [],
      event: []
    };

    this.currentPage = 0;

    this.selectedFilters.forEach(filter => {
      const lcFilter = filter.toLowerCase();
      if (this.typeCategory.map(f => f.toLowerCase()).includes(lcFilter)) {
        groupedFilters['type'].push(lcFilter);
      } else if (this.colorCategory.map(f => f.toLowerCase()).includes(lcFilter)) {
        groupedFilters['color'].push(lcFilter);
      } else if (this.eventCategory.map(f => f.toLowerCase()).includes(lcFilter)) {
        groupedFilters['event'].push(lcFilter);
      }
    });

    this.filteredProducts = this.products.filter(product => {
      const tags = product.tags?.map(t => t.toLowerCase()) || [];

      const matchesType = groupedFilters['type'].length === 0 || groupedFilters['type'].some(f => tags.includes(f));
      const matchesColor = groupedFilters['color'].length === 0 || groupedFilters['color'].some(f => tags.includes(f));
      const matchesEvent = groupedFilters['event'].length === 0 || groupedFilters['event'].some(f => tags.includes(f));
      
      console.log("customSelection = " + this.customSelection);
      const matchesCustom =
        this.customSelection === 'Any' ||
        (this.customSelection === 'Custom' && product.custom === true) ||
        (this.customSelection === 'Not Custom' && product.custom !== true);  
      
      const matchesSearch = !search || product.name.toLowerCase().includes(search);
      
      const matchesPrice =
        (this.minPrice === null || product.price >= this.minPrice) &&
        (this.maxPrice === null || product.price <= this.maxPrice);

      return matchesType && matchesColor && matchesEvent && matchesCustom && matchesSearch && matchesPrice;
    });
  }

  onSearchChange(): void {
    this.applyAllFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyAllFilters();
  }

  applyPriceFilter(): void {
    this.applyAllFilters();
  }

  clearAllFilters(): void {
    this.selectedFilters = [];
    this.minPrice = 0;
    this.maxPrice = 100;
    // this.searchQuery = '';

    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(cb => cb.checked = false);

    this.updateURLFilters();
    this.applyAllFilters();
  }


  removeFilter(filter: string): void {
    this.selectedFilters = this.selectedFilters.filter(f => f !== filter);

    const checkbox = document.querySelector(`input[type="checkbox"][value="${filter}"]`) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }

    this.updateURLFilters();
    this.applyAllFilters();
  }
}
