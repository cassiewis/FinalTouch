import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {
  private apiUrl = 'http://localhost:8080/api/admin/products'; // Admin API endpoint

  // Admin-specific product cache (includes all products)
  private adminProductsCache: Product[] = [];
  private adminProductsSubject = new BehaviorSubject<Product[]>(this.adminProductsCache);
  adminProducts$ = this.adminProductsSubject.asObservable();

  constructor(private http: HttpClient, private productService: ProductService) {}

  /**
   * Fetch all products for admin, including inactive or archived products.
   */
  fetchAdminProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(products => {
        console.log('Fetched admin products:', products);
        this.adminProductsCache = products; // All products for admin
        this.adminProductsSubject.next(this.adminProductsCache); // Notify admin-specific subscribers
      })
    );
  }

  /**
   * Get all products for admin (all products).
   */
  getAdminProducts(): Observable<Product[]> {
    if (this.adminProductsCache.length === 0) {
      return this.fetchAdminProducts();
    }
    return this.adminProducts$;
  }

  /**
   * Add a product as an admin.
   */
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(newProduct => {
        console.log('Added product as admin:', newProduct);
        this.adminProductsCache.push(newProduct); // Add to admin cache
        this.adminProductsSubject.next([...this.adminProductsCache]); // Notify admin cache
      })
    );
  }

  /**
   * Update an existing product as an admin.
   */
  updateProduct(product: Product): Observable<Product> {
    const url = `${this.apiUrl}/${product.productId}`;
    return this.http.put<Product>(url, product).pipe(
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
    const url = `${this.apiUrl}/${productId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        console.log('Deleted product as admin:', productId);
        this.adminProductsCache = this.adminProductsCache.filter(p => p.productId !== productId);
        this.adminProductsSubject.next([...this.adminProductsCache]);
      })
    );
  }
}