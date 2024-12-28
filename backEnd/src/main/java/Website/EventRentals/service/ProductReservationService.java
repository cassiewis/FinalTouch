package Website.EventRentals.service;
import Website.EventRentals.model.ProductReservation;
import Website.EventRentals.repositories.ProductReservationRepository;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductReservationService {

    private final ProductReservationRepository productReservationRepository;

    @Autowired
    public ProductReservationService(ProductReservationRepository productReservationRepository) {
        this.productReservationRepository = productReservationRepository;
    }

    public ProductReservation addProductReservation(String productId, LocalDate date, String reservationId, String status) {
        ProductReservation productReservation = new ProductReservation();
        productReservation.setProductId(productId);
        productReservation.setDate(date);
        productReservation.setReservationId(reservationId);
        productReservation.setStatus(status);

        return productReservationRepository.save(productReservation);
    }
}
