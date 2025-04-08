import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Reservation } from '../../models/reservation.model';
import { AuthService } from '../auth.service';
import { ReservationService } from '../../services/reservation.service';

@Injectable({
  providedIn: 'root'
})
export class AdminReservationsService {
    private apiUrl = 'http://localhost:8080/api/admin/reservations'; // Admin API endpoint

    private autoRefreshInterval = 86400000; // Auto-refresh every 24 hours (in milliseconds)

    // Admin-specific reservation cache (includes all reservations)
    private sessionStorageKey = 'adminReservationsCache'; // Key to store cache in localStorage
    private adminReservationsCache: Reservation[] | null = null; // Initialize as null
    private adminReservationsSubject = new BehaviorSubject<Reservation[]>([]);
    adminReservations$ = this.adminReservationsSubject.asObservable();
  
    constructor(private http: HttpClient, private authService: AuthService, private reservationService: ReservationService) {
      // Check for expired cache on app load
      this.adminReservationsCache = this.loadCacheFromSessionStorage();
    }

    /**
     * Fetch reservations from the backend and update the cache and observable.
     */
    fetchReservations(): Observable<Reservation[]> {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.getAdminToken() // Use a token or other method to authenticate as admin
      });
      return this.http.get<Reservation[]>(this.apiUrl, { headers }).pipe(
        tap(reservations => {
          console.log('Fetched reservations from backend:', reservations);
          this.adminReservationsCache = reservations;
          this.saveCacheToSessionStorage(reservations); // Save to localStorage
        })
      );
    }

    /**
     * Get all reservations
     * Uses cached products if available; otherwise fetches from the backend
     */
    getAdminReservations(): Observable<Reservation[]> {
      if (!this.adminReservationsCache) {
        console.log('Cache is empty, loading from localStorage...');
        this.adminReservationsCache = this.loadCacheFromSessionStorage();
      }
      if (this.adminReservationsCache.length === 0) {
        return this.fetchReservations();
      }
      this.adminReservationsSubject.next(this.adminReservationsCache);
      return this.adminReservations$;
    }

     /**
     * Gets a reservation as an admin.
     */
    getAdminReservation(reservationId: string): Observable<Reservation> {
      if (!this.adminReservationsCache) {
        this.adminReservationsCache = this.loadCacheFromSessionStorage();
      }
      const reservation = this.adminReservationsCache.find(r => r.reservationId === reservationId);
      if (reservation) {
        return new Observable<Reservation>(observer => {
          observer.next(reservation);
          observer.complete();
        });
      }
      return this.http.get<Reservation>(`${this.apiUrl}/${reservationId}`);
    }

    // Add a new reservation
    addReservation(reservation: Reservation): Observable<Reservation> {
      return this.reservationService.addReservation(reservation).pipe(
        tap(newReservation => {
          console.log('AdminReservationsService: New reservation added:', newReservation);
    
          // Update the cache if it exists, or initialize it if null
          if (!this.adminReservationsCache) {
            this.adminReservationsCache = this.loadCacheFromSessionStorage();
          }
          this.adminReservationsCache.push(newReservation);
          // Save updated cache to sessionStorage
          this.saveCacheToSessionStorage(this.adminReservationsCache);
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
          // Update the cache if it exists, or initialize it if null
          if (!this.adminReservationsCache) {
            this.adminReservationsCache = this.loadCacheFromSessionStorage();
          }
          const index = this.adminReservationsCache.findIndex(r => r.reservationId === updatedReservation.reservationId);
          if (index > -1) {
            this.adminReservationsCache[index] = updatedReservation;
            this.saveCacheToSessionStorage(this.adminReservationsCache);
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
        if (!this.adminReservationsCache) {
          this.adminReservationsCache = this.loadCacheFromSessionStorage();
        }
        this.adminReservationsCache = this.adminReservationsCache.filter(r => r.reservationId !== reservationId);
        this.adminReservationsSubject.next([...this.adminReservationsCache]);
      })
    );
  }

  updateReservationStatus(reservationId: string, status: string): Observable<void> {
    const token = this.getAdminToken(); // Retrieve the JWT token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<void>(`${this.apiUrl}/changeStatus/${reservationId}`, status, { headers }).pipe(
      tap(() => {
        if (!this.adminReservationsCache) {
          this.adminReservationsCache = this.loadCacheFromSessionStorage();
        }
        const index = this.adminReservationsCache.findIndex(r => r.reservationId === reservationId);
        if (index > -1) {
          this.adminReservationsCache[index].status = status;
        }
      })
    );
  }

  /**
   * Save cache to session storage.
   */
  private saveCacheToSessionStorage(reservations: Reservation[]): void {
    const cacheData = {
      reservations,
      timestamp: Date.now() // Save the current timestamp
    };
    sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(cacheData));
    this.adminReservationsSubject.next(reservations); // Notify subscribers
  }

  /**
   * Load cache from session storage.
   */
  private loadCacheFromSessionStorage(): Reservation[] {
    const cachedData = sessionStorage.getItem(this.sessionStorageKey);
    if (cachedData) {
      const { reservations, timestamp } = JSON.parse(cachedData);
  
      // Check if the cache is older than 24 hours
      if (Date.now() - timestamp > this.autoRefreshInterval) {
        console.log('Cache expired, clearing sessionStorage...');
        sessionStorage.removeItem(this.sessionStorageKey); // Clear expired cache
        return [];
      }
      return reservations;
    }
    return [];
  }

  private getAdminToken(): string {
    // Retrieve the admin token from local storage or another secure place
    return this.authService.getToken() || '';
  }


}