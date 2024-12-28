import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';
  private productsCache: Product[] = this.loadCacheFromLocalStorage();
  private productsSubject = new BehaviorSubject<Product[]>(this.productsCache || []);
  products$ = this.productsSubject.asObservable();
  private localStorageKey = 'productsCache';

  private autoRefreshInterval = 1800000; // Auto-refresh every 30 minutes (in milliseconds)

  constructor(private http: HttpClient) {
    // Start auto-refresh timer
    this.startAutoRefresh();
  }

  /**
   * Fetch products from the backend and update the cache and observable.
   */
  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(products => {
        console.log('Fetched products from backend:', products);
        this.productsCache = products;
        this.saveCacheToLocalStorage(products); // Save to localStorage
        this.productsSubject.next(products); // Notify subscribers
      })
    );
  }

  /**
   * Get all products
   * Uses cached products if available; otherwise fetches from the backend.
   */
  getProducts(): Observable<Product[]> {
    if (this.productsCache.length === 0) {
      // Fetch from backend if cache is empty
      return this.fetchProducts().pipe(
        tap(products => {
          this.productsCache = products;
          this.productsSubject.next(this.productsCache); // Notify active products
        }),
        switchMap(() => this.products$) // Return active products as observable
      );
    }
    return this.products$;
  }

  /**
   * Get a single product by its ID.
   * Always fetches from the backend to ensure the latest data.
   */
  // todo only return active product
  getProduct(productId: string): Observable<Product> {
    const url = `${this.apiUrl}/${productId}`;
    return this.http.get<Product>(url).pipe(
      tap(product => {
        console.log('Fetched product:', product);
      })
    );
  }

  /**
   * Save cache to localStorage.
   */
  private saveCacheToLocalStorage(products: Product[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(products));
  }

  /**
   * Load cache from localStorage.
   */
  private loadCacheFromLocalStorage(): Product[] {
    const cachedData = localStorage.getItem(this.localStorageKey);
    return cachedData ? JSON.parse(cachedData) : [];
  }

  /**
   * Add a product to the cache (used by AdminProductService as well).
   */
  addProductToCache(product: Product): void {
    this.productsCache.push(product);
    this.productsSubject.next([...this.productsCache]);
  }

  /**
   * Update a product in the cache (used by AdminProductService as well).
   */
  updateProductCache(updatedProduct: Product): void {
    const index = this.productsCache.findIndex(p => p.productId === updatedProduct.productId);
    if (index > -1) {
      this.productsCache[index] = updatedProduct;
      this.productsSubject.next([...this.productsCache]);
    }
  }

  /**
   * Remove a product from the cache (used by AdminProductService as well).
   */
  removeProductFromCache(productId: string): void {
    this.productsCache = this.productsCache.filter(p => p.productId !== productId);
    this.productsSubject.next([...this.productsCache]);
  }

  /**
   * Start an auto-refresh timer to periodically fetch products from the backend.
   */
  private startAutoRefresh(): void {
    timer(0, this.autoRefreshInterval)
      .pipe(switchMap(() => this.fetchProducts()))
      .subscribe();
  }
}
