import { Injectable } from '@angular/core';
import { Reservation } from '../models/reservation.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, timer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api/reservations';
  private localStorageKey = 'reservationsCache'; // Key to store cache in localStorage
  private reservationsCache: Reservation[] = this.loadCacheFromLocalStorage();
  private reservationsSubject = new BehaviorSubject<Reservation[]>(this.reservationsCache || []);
  private activeReservationsSubject = new BehaviorSubject<Reservation[]>([]);
  reservations$ = this.reservationsSubject.asObservable();
  reservationsProducts$ = this.activeReservationsSubject.asObservable();

  private autoRefreshInterval = 1800000; // Auto-refresh every 30 minutes (in milliseconds)

  constructor(private http: HttpClient) { 
  }

  /**
   * Fetch reservations from the backend and update the cache and observable.
   */
  fetchReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl).pipe(
      tap(reservations => {
        console.log('Fetched reservations from backend:', reservations);
        this.reservationsCache = reservations;
        this.saveCacheToLocalStorage(reservations); // Save to localStorage
        this.reservationsSubject.next(reservations); // Notify subscribers
      })
    );
  }

  // Fetch all reservations from the API
  getReservations(): Observable<Reservation[]> {
    if (this.reservationsCache.length == 0) {
      return this.fetchReservations();
    }
    return this.reservations$;
  }

  getReservation(reservationId: string): Observable<Reservation> {
    const url = `${this.apiUrl}/${reservationId}`;
    return this.http.get<Reservation>(url).pipe(
      tap(reservation => {
        console.log("Fetched Reservation: ", reservation);
      })
    );
  }

  // Add a new reservation
  addReservation(reservation: Reservation): Observable<Reservation> {
    // generate random reservationId
    // todo check first that reservationId doesnt exist
    const name = reservation.name.replace(/\s+/g, '');
    const generatedString = Math.random().toString(36).substring(2, 10);
    reservation.reservationId = name + "-" + generatedString;

    console.log("ReservationService: adding reservation");
    return this.http.post<Reservation>(this.apiUrl, reservation).pipe(
      tap(newReservation => {
        console.log('Added reservation:', newReservation);
        this.reservationsCache.push(newReservation);
        this.reservationsSubject.next([...this.reservationsCache]); // Notify subscribers
      })
    );
  }

  /**
   * Update an existing reservation in the backend and synchronize the cache.
   */
  updateReservation(reservation: Reservation): Observable<Reservation> {
    const url = `${this.apiUrl}/${reservation.reservationId}`;
    return this.http.put<Reservation>(url, reservation).pipe(
      tap(updatedReservation => {
        console.log('Updated product:', updatedReservation);
        const index = this.reservationsCache.findIndex(r => r.reservationId === updatedReservation.reservationId);
        if (index > -1) {
          this.reservationsCache[index] = updatedReservation;
          this.reservationsSubject.next([...this.reservationsCache]); // Notify subscribers
        }
      })
    );
  }

  // Delete a reservation and update the cache
  deleteReservation(reservationId: string): Observable<void> {
    const url = `${this.apiUrl}/${reservationId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        console.log('Reservation deleted:', reservationId);
        // Remove the deleted reservation from the cache
        this.reservationsCache = this.reservationsCache.filter(reservation => reservation.reservationId !== reservationId);
        this.reservationsSubject.next(this.reservationsCache); // Emit updated reservations list
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
}