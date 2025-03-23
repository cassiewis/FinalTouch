import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private apiUrl = 'http://localhost:8080/api/images';

  constructor(private http: HttpClient) { }

  // Fetch all image URLs with a specific cache key
  getInspoImageUrls(): Observable<string[]> {
    const cacheKey = "cacheInspoImagesKey";
    const cachedInspoImageUrls = this.getCachedImageUrls(cacheKey);
    if (cachedInspoImageUrls) {
      return of(cachedInspoImageUrls);
    } else {
      return this.http.get<string[]>(`${this.apiUrl}/inspo`).pipe(
        tap(imageUrls => this.cacheImageUrls(cacheKey, imageUrls))
      );
    }
  }

  // Fetch a single image URL by key
  getImageUrl(imageKey: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${imageKey}`);
  }

  // Cache image URLs in local storage with a specific cache key
  private cacheImageUrls(cacheKey: string, imageUrls: string[]): void {
    localStorage.setItem(cacheKey, JSON.stringify(imageUrls));
  }

  // Retrieve cached image URLs from local storage with a specific cache key
  private getCachedImageUrls(cacheKey: string): string[] | null {
    const cachedImageUrls = localStorage.getItem(cacheKey);
    return cachedImageUrls ? JSON.parse(cachedImageUrls) : null;
  }
}