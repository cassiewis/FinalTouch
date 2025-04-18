import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { tap } from 'rxjs/operators';
import { ApiResponse } from '../models/ApiResponse.interface';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';
  private productsCache: Product[] | null = null; // Initialize as null
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();
  private sessionStorageKey = 'productsCache';

  private autoRefreshInterval = 86400000; // Auto-refresh every 24 hours (in milliseconds)

  constructor(private http: HttpClient) {
    // Check for expired cache on app load
    this.productsCache = this.loadCacheFromSessionStorage();
  }

  /**
   * Fetch products from the backend and update the cache and observable.
   */
  fetchProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl).pipe(
      map(response => {
        if (response.success) return response.data; // Extract the Product array from the ApiResponse
        else throw new Error(response.message || 'Failed to fetch products');
      }),
      tap(products => {
        this.productsCache = products;
        this.saveCacheToSessionStorage(products); // Save to localStorage
        this.productsSubject.next(products); // Notify subscribers
      })
    );
  }

  /**
   * Get all products
   * Uses cached products if available; otherwise fetches from the backend.
   */
  getProducts(): Observable<Product[]> {
    if (!this.productsCache) {
      console.log('Cache is empty, loading from localStorage...');
      this.productsCache = this.loadCacheFromSessionStorage();
    }

    if (this.productsCache.length === 0) {
      console.log('Cache is still empty, fetching products from backend...');
      return this.fetchProducts();
    }

    console.log('Returning cached products:', this.productsCache);
    this.productsSubject.next(this.productsCache);
    return this.products$;
  }

  /**
   * Get a single product by its ID.
   * Gets product from the saved products cache.
   */
  getProduct(productId: string): Observable<Product> {
    /* check if cache is null or not */
    if (!this.productsCache) {
      console.log('Cache is empty, loading from localStorage...');
      this.productsCache = this.loadCacheFromSessionStorage();
    }
    // if product is found in the cache, return it, otherwise fetch from backend
    const product = this.productsCache.find(p => p.productId === productId);
    if (product) {
      return new Observable<Product>(subscriber => {
        subscriber.next(product);
        subscriber.complete();
      });
    }
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${productId}`).pipe(
      map(response => {
        if (response.success) return response.data; // Extract the Product array from the ApiResponse
        else throw new Error(response.message || 'Failed to fetch products');
      })  
    );
  }

  /**
   * Save cache to session storage.
   */
  private saveCacheToSessionStorage(products: Product[]): void {
    const cacheData = {
      products,
      timestamp: Date.now() // Save the current timestamp
    };
    sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(cacheData));
  }

  /**
   * Load cache from session storage.
   */
  private loadCacheFromSessionStorage(): Product[] {
    const cachedData = sessionStorage.getItem(this.sessionStorageKey);
    if (cachedData) {
      const { products, timestamp } = JSON.parse(cachedData);
  
      // Check if the cache is older than 24 hours
      if (Date.now() - timestamp > this.autoRefreshInterval) {
        console.log('Cache expired, clearing sessionStorage...');
        sessionStorage.removeItem(this.sessionStorageKey); // Clear expired cache
        return [];
      }
  
      return products;
    }
    return [];
  }

}
