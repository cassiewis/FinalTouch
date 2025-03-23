import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {
    private apiUrl = 'http://localhost:8080/api/admin/products'; // Admin API endpoint

    // Admin-specific product cache (includes all products)
    private localStorageKey = 'adminProductsCache'; // Key to store cache in localStorage
    private adminProductsCache: Product[] = this.loadCacheFromLocalStorage();
    private adminProductsSubject = new BehaviorSubject<Product[]>(this.adminProductsCache || []);
    adminProducts$ = this.adminProductsSubject.asObservable();

    constructor(private http: HttpClient, private authService: AuthService) {}

    /**
   * Fetch all products for admin, including inactive or archived products.
   */
    fetchAdminProducts(): Observable<Product[]> {
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + this.getAdminToken() // Use a token or other method to authenticate as admin
        });

        console.log("Products token: ", this.getAdminToken());

        return this.http.get<Product[]>(this.apiUrl, { headers }).pipe(
        tap(products => {
            console.log('Fetched admin products:', products);
            this.adminProductsCache = products; // All products for admin
            this.saveCacheToLocalStorage(products);
            this.adminProductsSubject.next(this.adminProductsCache); // Notify admin-specific subscribers
        })
        );
    }

    /**
     * Get all products
     * Uses cached products if available; otherwise fetches from the backend.
     */
    getAdminProducts(): Observable<Product[]> {
      if (this.adminProductsCache.length === 0) {
        // Fetch from backend if cache is empty
        return this.fetchAdminProducts().pipe(
          tap(products => {
            this.adminProductsCache = products;
            this.adminProductsSubject.next(this.adminProductsCache); // Notify active products
          }),
          switchMap(() => this.adminProducts$) // Return products as observable
        );
      }
      return this.adminProducts$;
    }

    addProduct(product: Product): Observable<Product> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.getAdminToken() // Use a token or other method to authenticate as admin
      });
  
      return this.http.post<Product>(this.apiUrl, product, { headers });
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
          const index = this.adminProductsCache.findIndex(p => p.productId === updatedProduct.productId);
          if (index > -1) {
            this.adminProductsCache[index] = updatedProduct;
            this.adminProductsSubject.next([...this.adminProductsCache]);
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
          this.adminProductsCache = this.adminProductsCache.filter(p => p.productId !== productId);
          this.adminProductsSubject.next([...this.adminProductsCache]);
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

    private getAdminToken(): string {
        // Retrieve the admin token from local storage or another secure place
        return this.authService.getToken() || ''; 
    }
}