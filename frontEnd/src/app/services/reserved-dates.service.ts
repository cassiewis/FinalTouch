import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class ReservedDatesService {

  private apiUrl = 'http://localhost:8080/api/reservedDates'; // Replace with your backend API URL if different

  constructor(private http: HttpClient) { }

  // Fetch all reserved dates
  getAllReservedDates(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  // Fetch reserved dates for a specific product
  getReservedDatesByProductId(productId: string): Observable<Date[]> {
    console.log("called GetReservedDatesByProductId: ", productId);
    return this.http.get<string[]>(`${this.apiUrl}/dates/${productId}`).pipe(
      map((datestrings: string[]) => datestrings.map(datestring => new Date(datestring))) // Convert strings to Date objects
    );
  }
  

}


// ReservedDate model (you can move this to a separate file if needed)
export interface ReservedDate {
  productId: string;
  date: string;
  reservationId?: string;
  status?: string; // Optional, depending on your backend model
}