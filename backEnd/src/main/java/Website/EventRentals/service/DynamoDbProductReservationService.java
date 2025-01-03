package Website.EventRentals.service;

import Website.EventRentals.model.ProductReservation;
import Website.EventRentals.repositories.DynamoDbProductReservationRepository;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DynamoDbProductReservationService {

    private final DynamoDbProductReservationRepository dynamoDbProductReservationRepository;

    @Autowired
    public DynamoDbProductReservationService(DynamoDbProductReservationRepository dynamoDbProductReservationRepository) {
        this.dynamoDbProductReservationRepository = dynamoDbProductReservationRepository;
    }

    public ProductReservation addProductReservation(String productId, LocalDate date, String reservationId, String status) {
        ProductReservation productReservation = new ProductReservation();
        productReservation.setProductId(productId);
        productReservation.setDate(date);
        productReservation.setReservationId(reservationId);
        productReservation.setStatus(status);

        return dynamoDbProductReservationRepository.save(productReservation);
    }
}
