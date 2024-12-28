package Website.EventRentals.controller;
import Website.EventRentals.model.ProductReservation;
import Website.EventRentals.service.ProductReservationService;

import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/productreservations")
public class ProductReservationController {

    @Autowired
    private ProductReservationService productReservationService;

    @PostMapping("/add")
    public ProductReservation addReservation(@RequestBody ProductReservationRequest request) {
        return productReservationService.addProductReservation(
                request.getProductId(),
                request.getDate(),
                request.getReservationId(),
                request.getStatus()
        );
    }
}

class ProductReservationRequest {
    @NotNull
    private String productId;
    @NotNull
    private LocalDate date;
    @NotNull
    private String reservationId;
    @NotNull
    private String status;

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductId() {
        return productId;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setReservationId(String reservationId) {
        this.reservationId = reservationId;
    }

    public String getReservationId() {
        return reservationId;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}
