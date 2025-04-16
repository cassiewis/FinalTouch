package Website.EventRentals.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import Website.EventRentals.model.Reservation;
import Website.EventRentals.service.S3ServiceReservation;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST })
public class ReservationController {

    private final S3ServiceReservation s3ServiceReservation;

    // Constructor injection for S3ServiceReservation
    public ReservationController(S3ServiceReservation s3ServiceReservation) {
        this.s3ServiceReservation = s3ServiceReservation;
    }

    // Endpoint for uploading a reservation
    @PostMapping
    public ResponseEntity<Reservation> addReservation(@RequestBody Reservation reservation) {
        try {
            Reservation addedReservation = s3ServiceReservation.addReservation(reservation);
            return ResponseEntity.ok(addedReservation);
        } catch (Exception e) {
            System.out.println("ReservationController: Error adding reservation: " + e);
            return ResponseEntity.badRequest().body(null);
        }
    }

}
