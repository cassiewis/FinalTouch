import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {
  private apiUrl = 'http://localhost:8080/api/admin/products'; // Admin API endpoint

  // Admin-specific product cache (includes all products)
  private sessionStorageKey = 'adminProductsCache'; // Key to store cache in localStorage
  private adminProductsCache: Product[] | null = null;
  private adminProductsSubject = new BehaviorSubject<Product[]>([]);
  adminProducts$ = this.adminProductsSubject.asObservable();

  private autoRefreshInterval = 86400000; // Auto-refresh every 24 hours (in milliseconds)

  constructor(private http: HttpClient, private authService: AuthService) {
    // Check for expired cache on app load
    this.adminProductsCache = this.loadCacheFromSessionStorage();
  }

  /**
   * Fetch all products for admin, including inactive or archived products.
   */
  fetchAdminProducts(): Observable<Product[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.getAdminToken() // Use a token or other method to authenticate as admin
    });
    return this.http.get<Product[]>(this.apiUrl, { headers }).pipe(
    tap(products => {
        console.log('Fetched admin products:', products);
        this.adminProductsCache = products; // All products for admin
        this.saveCacheToSessionStorage(products);
    })
    );
  }

  /**
   * Get all products
   * Uses cached products if available; otherwise fetches from the backend.
   */
  getAdminProducts(): Observable<Product[]> {
    if (!this.adminProductsCache) {
      console.log('Cache is empty, loading from localStorage...');
      this.adminProductsCache = this.loadCacheFromSessionStorage();
    }
    if (this.adminProductsCache.length === 0) {
      return this.fetchAdminProducts();
    }
    this.adminProductsSubject.next(this.adminProductsCache);
    return this.adminProducts$;
  }

  /**
   * Add a new product as an admin.
   */
  addProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.getAdminToken() // Use a token or other method to authenticate as admin
    });
    return this.http.post<Product>(this.apiUrl, product, { headers }).pipe(
      tap(newProduct => {
        console.log('Added product as admin:', newProduct);
        // update cache
        if (!this.adminProductsCache) {
          this.adminProductsCache = this.loadCacheFromSessionStorage();
        }
        this.adminProductsCache.push(newProduct);
        this.saveCacheToSessionStorage(this.adminProductsCache);
      })
    );
  }

  /**
   * Update an existing product as an admin.
   */
  updateProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.getAdminToken() // Use a token or other method to authenticate as admin
    });

    const url = `${this.apiUrl}/${product.productId}`;
    return this.http.put<Product>(url, product, { headers }).pipe(
      tap(updatedProduct => {
        console.log('Updated product as admin:', updatedProduct);
        if (!this.adminProductsCache) {
          this.adminProductsCache = this.loadCacheFromSessionStorage();
        }
        const index = this.adminProductsCache.findIndex(p => p.productId === updatedProduct.productId);
        if (index > -1) {
          this.adminProductsCache[index] = updatedProduct;
          this.saveCacheToSessionStorage(this.adminProductsCache);
        }
        
      })
    );
  }

  /**
   * Delete a product.
   */
  deleteProduct(productId: string): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.getAdminToken() // Use a token or other method to authenticate as admin
    });

    return this.http.delete<void>(`${this.apiUrl}/${productId}`, { headers }).pipe(
      tap(() => {
        if (!this.adminProductsCache) {
          this.adminProductsCache = this.loadCacheFromSessionStorage();
        }
        const index = this.adminProductsCache.findIndex(p => p.productId === productId);
        if (index > -1) {
          this.adminProductsCache.splice(index, 1);
          this.saveCacheToSessionStorage(this.adminProductsCache);
        }
        
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
    this.adminProductsSubject.next(products); // Notify subscribers
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

  private getAdminToken(): string {
      // Retrieve the admin token from local storage or another secure place
      return this.authService.getToken() || ''; 
  }
}