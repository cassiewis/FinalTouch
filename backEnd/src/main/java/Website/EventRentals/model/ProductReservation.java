package Website.EventRentals.model;

import jakarta.persistence.*;
import java.time.LocalDate;

import org.hibernate.mapping.PrimaryKey;

@Entity
@Table(name = "ProductReservations")
@IdClass(PrimaryKey.class)
public class ProductReservation {

    @Id
    private PrimaryKey key;

    @DynamoDBAttribute(attributeName = "reservationId")
    private String reservationId;

    @DynamoDBAttribute(attributeName = "status")
    private String status;

    // Default constructor
    public ProductReservation() {}

    public ProductReservation(PrimaryKey key, String reservationId, String status) {
        this.key = key;
        this.reservationId = reservationId;
        this.status = status;
    }

    // Getters and setters
    public String getProductId() { 
        return key.getProductId();
    }

    public void setProductId(String productId) {
        if(key== null){
            key = new PrimaryKey();
        }
        key.setProductId(productId);
    }

    public LocalDate getDate() { 
        return key.getDate();
    }

    public void setDate(LocalDate date) {
        if(key== null){
            key = new PrimaryKey();
        }
        key.setDate(date);
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
