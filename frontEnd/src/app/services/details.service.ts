import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Review } from '../models/review.model';


@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  private apiUrl = 'http://localhost:8080/api/details';

  constructor(private http: HttpClient) {}

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews`).pipe(
      map((response: any) => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch reviews');
        }
      })
    );
  }
}
