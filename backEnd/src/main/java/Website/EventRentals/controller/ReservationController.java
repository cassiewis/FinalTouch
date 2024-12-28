package Website.EventRentals.controller;

import Website.EventRentals.model.Reservation;
import Website.EventRentals.service.S3ServiceReservation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*")
public class ReservationController {
    private final S3ServiceReservation s3ServiceReservation;

    // Constructor injection for S3ServiceReservation
    public ReservationController(S3ServiceReservation s3ServiceReservation) {
        this.s3ServiceReservation = s3ServiceReservation;
        System.out.println("ReservationController initialized");
    }

    // Endpoint for uploading a reservation
    @PostMapping
    public ResponseEntity<Reservation> addReservation(@RequestBody Reservation reservation) {
        try {
            Reservation addedReservation = s3ServiceReservation.addReservation(reservation);
            return ResponseEntity.ok(addedReservation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Endpoint for fetching all reservations
    @GetMapping
    public List<Reservation> getReservations() {
        return s3ServiceReservation.getReservations();
    }

    // Endpoint for fetching all reservations that are active, fulfilled, or pending
    @GetMapping("/active")
    public List<Reservation> getActiveReservations() {
        return s3ServiceReservation.getActiveReservations();
    }

    // Endpoint for fetching a single reservation by ID
    @GetMapping("/{reservationId}")
    public Reservation getReservation(@PathVariable String reservationId) {
        System.out.println("Get Reservation ran on ReservationController");
        try {
            return s3ServiceReservation.getReservation(reservationId);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found: " + reservationId, e);
        }
    }

    // Endpoint for updating an existing reservation
    @PutMapping("/{reservationId}")
    public String updateReservation(@PathVariable String reservationId, @RequestBody Reservation updatedReservation) {
        System.out.println("Update Reservation ran on ReservationController");
        try {
            return s3ServiceReservation.updateReservation(reservationId, updatedReservation);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // Method to delete a reservation by ID from S3
    @DeleteMapping("/api/reservations/{reservationId}")
    public ResponseEntity<String> deleteReservation(@PathVariable String reservationId) {
        try {
            s3ServiceReservation.deleteReservation(reservationId);
            return ResponseEntity.ok("Reservation deleted successfully from S3");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting reservation from S3: " + e.getMessage());
        }
    }
}
