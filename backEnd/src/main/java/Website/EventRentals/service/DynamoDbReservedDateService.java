package Website.EventRentals.service;
import Website.EventRentals.repositories.DynamoDbReservedDateRepository;
import Website.EventRentals.model.ReservedDate;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;

@Service
public class DynamoDbReservedDateService {

    private final DynamoDbEnhancedClient dynamoDbEnhancedClient;
    private final DynamoDbTable<ReservedDate> reservedDateTable;
    private final DynamoDbReservedDateRepository reservedDateRepository;

    @Autowired
    public DynamoDbReservedDateService(DynamoDbEnhancedClient generalDynamoDbEnhancedClient, 
                                        DynamoDbReservedDateRepository reservedDateRepository) {
        this.dynamoDbEnhancedClient = generalDynamoDbEnhancedClient;
        this.reservedDateTable = dynamoDbEnhancedClient.table("ProductReservations", TableSchema.fromBean(ReservedDate.class));
        this.reservedDateRepository = reservedDateRepository;
    }

    // Fetch all product reservations from DynamoDB
    public List<ReservedDate> getAllReservedDates() {
        ScanEnhancedRequest scanRequest = ScanEnhancedRequest.builder().build();
        return StreamSupport.stream(reservedDateTable.scan(scanRequest).items().spliterator(), false)
                .collect(Collectors.toList());
    }

    public boolean itemExists(String productId, String date) {
        ReservedDate reservedDate = reservedDateRepository.get(productId, date);
        return reservedDate != null;
    }
}