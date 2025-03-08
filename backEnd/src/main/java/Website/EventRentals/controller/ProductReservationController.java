package Website.EventRentals.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Website.EventRentals.model.ProductReservation;
import Website.EventRentals.service.DynamoDbProductReservationService;

@RestController
@RequestMapping("/api/productreservations")
public class ProductReservationController {

    private final DynamoDbProductReservationService dynamoDbProductReservationService;

    @Autowired
    public ProductReservationController(DynamoDbProductReservationService dynamoDbProductReservationService) {
        this.dynamoDbProductReservationService = dynamoDbProductReservationService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<ProductReservation> getAllProductReservations() {
        return dynamoDbProductReservationService.getAllProductReservations();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ProductReservation addReservation(@RequestBody ProductReservationRequest request) {
        return dynamoDbProductReservationService.addProductReservation(
                request.getProductId(),
                request.getDate(),
                request.getReservationId(),
                request.getStatus()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update")
    public ProductReservation updateReservation(@RequestBody ProductReservationRequest request) {
        return dynamoDbProductReservationService.updateProductReservation(
                request.getProductId(),
                request.getDate(),
                request.getReservationId(),
                request.getStatus()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public void deleteReservation(@RequestBody ProductReservationRequest request) {
        dynamoDbProductReservationService.deleteProductReservation(
                request.getProductId(),
                request.getDate(),
                request.getReservationId()
        );
    }
}

class ProductReservationRequest {
    private String productId;
    private LocalDate date;
    private String reservationId;
    private String status;

    // Getters and setters
    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getReservationId() {
        return reservationId;
    }

    public void setReservationId(String reservationId) {
        this.reservationId = reservationId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}