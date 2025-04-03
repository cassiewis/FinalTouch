package Website.EventRentals.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Website.EventRentals.repositories.DynamoDbReservedDateRepository;
import Website.EventRentals.shared.model.ReservedDate;

@Service
public class AdminDynamoDbReservedDateService {

    private final DynamoDbReservedDateRepository reservedDateRepository;

    @Autowired
    public AdminDynamoDbReservedDateService(DynamoDbReservedDateRepository reservedDateRepository) {
        this.reservedDateRepository = reservedDateRepository;
    }

    public ReservedDate addReservedDate(String productId, String date, String reservationId, String status) {
        try {
            ReservedDate reservedDate = new ReservedDate(productId, date, reservationId, status);
            System.out.println("Cassie Attempting to save ReservedDate: " + reservedDate);
            reservedDateRepository.save(reservedDate);
            System.out.println("Cassie Successfully saved ReservedDate: " + reservedDate);
            return reservedDate;
        } catch (Exception e) {
            System.out.println("Cassie ReservedDate class loader: " + ReservedDate.class.getClassLoader());
            System.out.println("Cassie Error saving ReservedDate with productId: " + productId + ", date: " + date + ", reservationId: " + reservationId + ", status: " + status + " error message: " +  e);
            throw e; // Re-throw the exception after logging
        }
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