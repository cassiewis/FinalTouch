import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private apiUrl = 'http://localhost:8080/api/images';
  private cacheKey = 'cachedImageUrls';

  constructor(private http: HttpClient) { }

  // Fetch all image URLs
  getAllImageUrls(): Observable<string[]> {
    const cachedImageUrls = this.getCachedImageUrls();
    if (cachedImageUrls) {
      return of(cachedImageUrls);
    } else {
      return this.http.get<string[]>(this.apiUrl).pipe(
        tap(imageUrls => this.cacheImageUrls(imageUrls))
      );
    }
  }

  // Fetch a single image URL by key
  getImageUrl(imageKey: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${imageKey}`);
  }

    // Cache image URLs in local storage
    private cacheImageUrls(imageUrls: string[]): void {
      localStorage.setItem(this.cacheKey, JSON.stringify(imageUrls));
    }
  
    // Retrieve cached image URLs from local storage
    private getCachedImageUrls(): string[] | null {
      const cachedImageUrls = localStorage.getItem(this.cacheKey);
      return cachedImageUrls ? JSON.parse(cachedImageUrls) : null;
    }
}