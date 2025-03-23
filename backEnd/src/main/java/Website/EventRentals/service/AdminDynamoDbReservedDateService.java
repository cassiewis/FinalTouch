package Website.EventRentals.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Website.EventRentals.model.ReservedDate;
import Website.EventRentals.repositories.DynamoDbReservedDateRepository;

@Service
public class AdminDynamoDbReservedDateService {

    private final DynamoDbReservedDateRepository reservedDateRepository;

    @Autowired
    public AdminDynamoDbReservedDateService(DynamoDbReservedDateRepository reservedDateRepository) {
        this.reservedDateRepository = reservedDateRepository;
    }

    public ReservedDate addReservedDate(String productId, String date, String reservationId, String status) {
        ReservedDate reservedDate = new ReservedDate();
        reservedDate.setProductId(productId);
        reservedDate.setDate(date);
        reservedDate.setReservationId(reservationId);
        reservedDate.setStatus(status);
        System.out.println("CASSIE ReservedDateService: adding reservedDate: " + reservedDate);
        return reservedDateRepository.save(reservedDate);
    }

    public void deleteReservedDate(String productId, String date) {
        if (itemExists(productId, date)) {
            reservedDateRepository.delete(productId, date);
        } else {
            throw new IllegalArgumentException("Reserved date not found for productId: " + productId + " and date: " + date);
        }
    }

    public boolean itemExists(String productId, String date) {
        ReservedDate reservedDate = reservedDateRepository.get(productId, date);
        return reservedDate != null;
    }
}