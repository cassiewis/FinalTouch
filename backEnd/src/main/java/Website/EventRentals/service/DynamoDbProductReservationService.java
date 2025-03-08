package Website.EventRentals.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Website.EventRentals.model.ProductReservation;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;

@Service
public class DynamoDbProductReservationService {

    private final DynamoDbEnhancedClient dynamoDbEnhancedClient;
    private final DynamoDbTable<ProductReservation> productReservationTable;

    @Autowired
    public DynamoDbProductReservationService(DynamoDbEnhancedClient generalDynamoDbEnhancedClient) {
        this.dynamoDbEnhancedClient = generalDynamoDbEnhancedClient;
        this.productReservationTable = dynamoDbEnhancedClient.table("ProductReservations", TableSchema.fromBean(ProductReservation.class));
    }

    // Fetch all product reservations from DynamoDB
    public List<ProductReservation> getAllProductReservations() {
        ScanEnhancedRequest scanRequest = ScanEnhancedRequest.builder().build();
        return StreamSupport.stream(productReservationTable.scan(scanRequest).items().spliterator(), false)
                .collect(Collectors.toList());
    }

    // Add a product reservation to DynamoDB
    public ProductReservation addProductReservation(String productId, LocalDate date, String reservationId, String status) {
        ProductReservation productReservation = new ProductReservation(productId, date, reservationId, status);
        productReservationTable.putItem(productReservation);
        return productReservation;
    }

    // Update a product reservation in DynamoDB
    public ProductReservation updateProductReservation(String productId, LocalDate date, String reservationId, String status) {
        ProductReservation productReservation = new ProductReservation(productId, date, reservationId, status);
        productReservationTable.updateItem(productReservation);
        return productReservation;
    }

    // Delete a product reservation from DynamoDB
    public void deleteProductReservation(String productId, LocalDate date, String reservationId) {
        ProductReservation productReservation = new ProductReservation(productId, date, reservationId, null);
        productReservationTable.deleteItem(productReservation);
    }
}