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

  private autoRefreshInterval = 1800000; // Auto-refresh every 30 minutes (in milliseconds)

  constructor(private http: HttpClient) {
  }

  // Add a new reservation
  addReservation(reservation: Reservation): Observable<Reservation> {
    // generate random reservationId
    // todo check first that reservationId doesnt exist
    const name = reservation.name.replace(/\s+/g, '');
    const generatedString = Math.random().toString(36).substring(2, 10);
    reservation.reservationId = name + "-" + generatedString;

    // set status as pending for security
    reservation.status = 'pending';

    console.log("ReservationService: adding reservation");
    return this.http.post<Reservation>(this.apiUrl, reservation).pipe(
      tap(newReservation => {
        console.log('Added reservation:', newReservation);
      })
    );
  }

}