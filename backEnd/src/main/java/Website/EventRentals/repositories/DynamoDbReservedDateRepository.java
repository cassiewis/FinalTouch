package Website.EventRentals.repositories;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import Website.EventRentals.shared.model.ReservedDate;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;

@Repository
public class DynamoDbReservedDateRepository {

    private final DynamoDbTable<ReservedDate> reservedDateTable;

    public DynamoDbReservedDateRepository(@Qualifier("adminDynamoDbEnhancedClient") DynamoDbEnhancedClient dynamoDbEnhancedClient) {
        this.reservedDateTable = dynamoDbEnhancedClient.table("ProductReservations", TableSchema.fromBean(ReservedDate.class));
    }

    // Your repository methods here

    public ReservedDate save(ReservedDate reservedDate) {
        reservedDateTable.putItem(reservedDate);
        return reservedDate;
    }

    public ReservedDate get(String productId, String date) {
        return reservedDateTable.getItem(r -> r.key(k -> k.partitionValue(productId).sortValue(date)));
    }

    public void delete(String productId, String date) {
        reservedDateTable.deleteItem(r -> r.key(k -> k.partitionValue(productId).sortValue(date)));
    }

    public List<String> getDatesByProductId(String productId) {
        System.out.println("DEBUG: productId = " + productId);
    return reservedDateTable.query(r -> r.queryConditional(QueryConditional.keyEqualTo(k -> k.partitionValue(productId))))
            .items()
            .stream()
            .map(ReservedDate::getDate) // Extract dates
            .collect(Collectors.toList());
    }

    public List<String> getAvailableProductIdsByDate(String date) {
        return reservedDateTable.index("date-productId-index") // Use the GSI name
                .query(r -> r.queryConditional(QueryConditional.keyEqualTo(k -> k.partitionValue(date))))
                .stream() // Stream over the pages
                .flatMap(page -> page.items().stream()) // Extract items from each page
                .map(ReservedDate::getProductId) // Extract product IDs
                .collect(Collectors.toList());
    }

    // Add more methods as needed
}