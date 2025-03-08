package Website.EventRentals.model;

import java.time.LocalDate;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

@DynamoDbBean
public class ProductReservation {
    private String productId;
    private LocalDate date;
    private String reservationId;
    private String status;

    // Default constructor
    public ProductReservation() {
    }

    // Parameterized constructor
    public ProductReservation(String productId, LocalDate date, String reservationId, String status) {
        this.productId = productId;
        this.date = date;
        this.reservationId = reservationId;
        this.status = status;
    }

    // Getters and setters
    @DynamoDbPartitionKey
    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    @DynamoDbSortKey
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