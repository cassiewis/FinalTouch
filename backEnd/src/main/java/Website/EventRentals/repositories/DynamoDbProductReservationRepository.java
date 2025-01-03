package Website.EventRentals.repositories;

import Website.EventRentals.model.ProductReservation;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbRequest;

@Repository
public class DynamoDbProductReservationRepository {

    private final DynamoDbTable<ProductReservation> productReservationTable;

    public DynamoDbProductReservationRepository(DynamoDbEnhancedClient enhancedClient) {
        this.productReservationTable = enhancedClient.table("ProductReservation", TableSchema.fromBean(ProductReservation.class));
    }

    public ProductReservation save(ProductReservation productReservation) {
        productReservationTable.putItem(productReservation);
        return productReservation; // Returning the saved entity
    }

    // Additional methods for fetching, updating, or deleting reservations can go here
}
