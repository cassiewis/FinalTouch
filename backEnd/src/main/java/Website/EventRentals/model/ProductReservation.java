package Website.EventRentals.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;


@DynamoDbBean
public class ProductReservation {

    private String productId;
    private String date;  // Change LocalDate to String for DynamoDB compatibility
    private String reservationId;
    private String status;

    // Partition key for DynamoDB (primary key)
    @DynamoDbPartitionKey
    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    // Sort key for DynamoDB (secondary sort key)
    @DynamoDbSortKey
    public String getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        // Convert LocalDate to String for storage in DynamoDB
        this.date = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    // Helper method to convert String back to LocalDate when fetching from DynamoDB
    public LocalDate getDateAsLocalDate() {
        return LocalDate.parse(this.date, DateTimeFormatter.ISO_LOCAL_DATE);
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
