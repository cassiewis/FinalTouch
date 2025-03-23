package Website.EventRentals.repositories;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import Website.EventRentals.model.ReservedDate;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

@Repository
public class DynamoDbReservedDateRepository {

    private final DynamoDbTable<ReservedDate> reservedDateTable;

    public DynamoDbReservedDateRepository(@Qualifier("adminDynamoDbEnhancedClient") DynamoDbEnhancedClient dynamoDbEnhancedClient) {
        this.reservedDateTable = dynamoDbEnhancedClient.table("ProductReservations", TableSchema.fromBean(ReservedDate.class));
    }

    // Your repository methods here

    public ReservedDate save(ReservedDate reservedDate) {
        System.out.println("CASSIE ReservedDateRepository: save reservedDate: " + reservedDate);
        System.out.println("CASSIE ReservedDateRepository: reservedDate productId: " + reservedDate.getProductId());
        System.out.println("CASSIE ReservedDateRepository: reservedDate date: " + reservedDate.getDate());
        System.out.println("CASSIE ReservedDateRepository: reservedDate status: " + reservedDate.getStatus());
        System.out.println("CASSIE ReservedDateRepository: reservedDate reservationId: " + reservedDate.getReservationId());
        reservedDateTable.putItem(reservedDate);
        System.out.println("CASSIE ReservedDateRepository: item was put");
        return reservedDate;
    }

    public ReservedDate get(String productId, String date) {
        return reservedDateTable.getItem(r -> r.key(k -> k.partitionValue(productId).sortValue(date)));
    }

    public void delete(String productId, String date) {
        reservedDateTable.deleteItem(r -> r.key(k -> k.partitionValue(productId).sortValue(date)));
    }

    // Add more methods as needed
}