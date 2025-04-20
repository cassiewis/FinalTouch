import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductListComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements AfterViewInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  selectedFilters: string[] = [];
  searchQuery: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  loading: boolean = true;

  showMobileFilter: boolean = false;
  isSmallScreen: boolean = false;


  typeCategory: string[] = ['Signage', 'Table Numbers', 'Florals', 'Lighting', 'Tableware'];
  colorCategory: string[] = ['White', 'Black', 'Gold', 'Silver', 'Clear', 'Brown', 'Blue', 'Green', 'Pink', 'Purple', 'Red', 'Yellow', 'Orange'];
  eventCategory: string[] = ['Wedding', 'Baby Shower', 'Engagement', 'Bridal Shower', 'Birthday'];
  customCategory: string[] = ['Custom'];

  openSections: { [key: string]: boolean } = {
    type: true,
    color: false,
    price: true,
    event: true,
    custom: true
  };

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


  toggleMobileFilter() {
    this.showMobileFilter = !this.showMobileFilter;
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
      event: [],
      custom: []
    };

    this.selectedFilters.forEach(filter => {
      const lcFilter = filter.toLowerCase();
      if (this.typeCategory.map(f => f.toLowerCase()).includes(lcFilter)) {
        groupedFilters['type'].push(lcFilter);
      } else if (this.colorCategory.map(f => f.toLowerCase()).includes(lcFilter)) {
        groupedFilters['color'].push(lcFilter);
      } else if (this.eventCategory.map(f => f.toLowerCase()).includes(lcFilter)) {
        groupedFilters['event'].push(lcFilter);
      } else if (this.customCategory.map(f => f.toLowerCase()).includes(lcFilter)) {
        groupedFilters['custom'].push(lcFilter);
      }
    });

    this.filteredProducts = this.products.filter(product => {
      const tags = product.tags?.map(t => t.toLowerCase()) || [];

      const matchesType = groupedFilters['type'].length === 0 || groupedFilters['type'].some(f => tags.includes(f));
      const matchesColor = groupedFilters['color'].length === 0 || groupedFilters['color'].some(f => tags.includes(f));
      const matchesEvent = groupedFilters['event'].length === 0 || groupedFilters['event'].some(f => tags.includes(f));
      const matchesCustom = groupedFilters['custom'].length === 0 || groupedFilters['custom'].some(f => tags.includes(f));
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
    this.minPrice = null;
    this.maxPrice = null;
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
