import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class AdminReservationsService {
    private apiUrl = 'http://localhost:8080/api/admin/reservations'; // Admin API endpoint

    // Admin-specific reservation cache (includes all reservations)
    private localStorageKey = 'reservationsCache'; // Key to store cache in localStorage
    private adminReservationsCache: Reservation[] = this.loadCacheFromLocalStorage();
    private adminReservationsSubject = new BehaviorSubject<Reservation[]>(this.adminReservationsCache || []);
    private adminActiveReservationsSubject = new BehaviorSubject<Reservation[]>([]);
    adminReservations$ = this.adminReservationsSubject.asObservable();
    adminActiveReservations$ = this.adminActiveReservationsSubject.asObservable();
  

    constructor(private http: HttpClient) {}

    /**
     * Fetch reservations from the backend and update the cache and observable.
     */
    fetchReservations(): Observable<Reservation[]> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.getAdminToken() // Use a token or other method to authenticate as admin
      });

      console.log("Reservations token: ", this.getAdminToken());

      return this.http.get<Reservation[]>(this.apiUrl, { headers }).pipe(
        tap(reservations => {
          console.log('Fetched reservations from backend:', reservations);
          this.adminReservationsCache = reservations;
          this.saveCacheToLocalStorage(reservations); // Save to localStorage
          this.adminReservationsSubject.next(reservations); // Notify subscribers
        })
      );
    }

    // Fetch all reservations from the API
      getReservations(): Observable<Reservation[]> {

        if (this.adminReservationsCache.length === 0) {
          // Fetch from backend if cache is empty
          return this.fetchReservations().pipe(
            tap(products => {
              this.adminReservationsCache = products;
              this.adminReservationsSubject.next(this.adminReservationsCache); // Notify active products
            }),
            switchMap(() => this.adminReservations$) // Return products as observable
          );
        }
        return this.adminReservations$;
      }
    
      getReservation(reservationId: string): Observable<Reservation> {
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + this.getAdminToken() // Use a token or other method to authenticate as admin
          });
          
        const url = `${this.apiUrl}/${reservationId}`;
        return this.http.get<Reservation>(url, { headers }).pipe(
          tap(reservation => {
            console.log("Fetched Reservation: ", reservation);
          })
        );
      }

      /**
     * Update an existing reservation in the backend and synchronize the cache.
     */
    updateReservation(reservation: Reservation): Observable<Reservation> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.getAdminToken() // Use a token or other method to authenticate as admin
    });

    const url = `${this.apiUrl}/${reservation.reservationId}`;
    return this.http.put<Reservation>(url, reservation, { headers }).pipe(
      tap(updatedReservation => {
        console.log('Updated reservation:', updatedReservation);
        const index = this.adminReservationsCache.findIndex(r => r.reservationId === updatedReservation.reservationId);
        if (index > -1) {
          this.adminReservationsCache[index] = updatedReservation;
          this.adminReservationsSubject.next([...this.adminReservationsCache]);
        }
      })
    );
  }

    // Delete a reservation and update the cache
    deleteReservation(reservationId: string): Observable<void> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.getAdminToken() // Use a token or other method to authenticate as admin
      });
  
      return this.http.delete<void>(`${this.apiUrl}/${reservationId}`, { headers }).pipe(
        tap(() => {
          console.log('Deleted reservation:', reservationId);
          this.adminReservationsCache = this.adminReservationsCache.filter(r => r.reservationId !== reservationId);
          this.adminReservationsSubject.next([...this.adminReservationsCache]);
        })
      );
    }

    /**
   * Save cache to localStorage.
    */
    private saveCacheToLocalStorage(reservations: Reservation[]): void {
      localStorage.setItem(this.localStorageKey, JSON.stringify(reservations));
    }
  
    /**
     * Load cache from localStorage.
     */
    private loadCacheFromLocalStorage(): Reservation[] {
      const cachedData = localStorage.getItem(this.localStorageKey);
      return cachedData ? JSON.parse(cachedData) : [];
    }

    private getAdminToken(): string {
      // Retrieve the admin token from local storage or another secure place
      return localStorage.getItem('authToken') || '';
    }


}