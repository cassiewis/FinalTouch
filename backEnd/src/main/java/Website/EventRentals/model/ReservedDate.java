package Website.EventRentals.model;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey;

@DynamoDbBean
public class ReservedDate {

    private String productId;
    private String date; // Store as String in DynamoDB
    private String reservationId;
    private String status;

    // Default constructor
    public ReservedDate() {
    }

    // Parameterized constructor
    public ReservedDate(String productId, String date, String reservationId, String status) {
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
    public String getDate() {
        return this.date;
    }

    public void setDate(String date) {
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