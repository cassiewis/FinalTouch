package Website.EventRentals.repositories;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import Website.EventRentals.model.ProductReservation;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

@Repository
public class DynamoDbProductReservationRepository {

    private final DynamoDbTable<ProductReservation> productReservationTable;

    public DynamoDbProductReservationRepository(@Qualifier("generalDynamoDbEnhancedClient") DynamoDbEnhancedClient dynamoDbEnhancedClient) {
        this.productReservationTable = dynamoDbEnhancedClient.table("ProductReservations", TableSchema.fromBean(ProductReservation.class));
    }

    // Your repository methods here

    public void save(ProductReservation productReservation) {
        productReservationTable.putItem(productReservation);
    }

    public ProductReservation get(String productId, LocalDate date) {
        return productReservationTable.getItem(r -> r.key(k -> k.partitionValue(productId).sortValue(date.toString())));
    }

    public void delete(String productId, LocalDate date) {
        productReservationTable.deleteItem(r -> r.key(k -> k.partitionValue(productId).sortValue(date.toString())));
    }

    // Add more methods as needed
}
