package Website.EventRentals.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import Website.EventRentals.model.Reservation;
import Website.EventRentals.service.AdminS3ServiceReservation;

@RestController
@RequestMapping("/api/admin/reservations")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE })
public class AdminReservationController {

    private final AdminS3ServiceReservation adminS3ServiceReservation;

    // Constructor injection for S3ServiceReservation
    public AdminReservationController(AdminS3ServiceReservation adminS3ServiceReservation) {
        this.adminS3ServiceReservation = adminS3ServiceReservation;
    }

    // Endpoint for fetching all reservations
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Reservation> getReservations() {
        return adminS3ServiceReservation.getReservations();
    }

    // Endpoint for fetching all reservations that are active, fulfilled, or pending
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/activeReservations")
    public List<Reservation> getActiveReservations() {
        return adminS3ServiceReservation.getActiveReservations();
    }

    // Endpoint for fetching a single reservation by ID
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("{reservationId}")
    public Reservation getReservation(@PathVariable String reservationId) {
        System.out.println("Get Reservation ran on ReservationController");
        try {
            return adminS3ServiceReservation.getReservation(reservationId);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found: " + reservationId, e);
        }
    }

    // Endpoint for updating an existing reservation
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{reservationId}")
    public String updateReservation(@PathVariable String reservationId, @RequestBody Reservation updatedReservation) {
        System.out.println("Update Reservation ran on ReservationController");
        try {
            return adminS3ServiceReservation.updateReservation(reservationId, updatedReservation);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // Method to delete a reservation by ID from S3
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/reservations/{reservationId}")
    public ResponseEntity<String> deleteReservation(@PathVariable String reservationId) {
        try {
            adminS3ServiceReservation.deleteReservation(reservationId);
            return ResponseEntity.ok("Reservation deleted successfully from S3");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting reservation from S3: " + e.getMessage());
        }
    }

    // Method to change the status of a reservation
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/changeStatus/{reservationId}")
    public ResponseEntity<String> changeReservationStatus(@PathVariable String reservationId, @RequestBody String status) {
        try {
            adminS3ServiceReservation.changeReservationStatus(reservationId, status);
            // reservationsService.changeReservationStatus(reservationId, status);
            return ResponseEntity.ok("Reservation status changed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error changing reservation status: " + e.getMessage());
        }
    }


}
