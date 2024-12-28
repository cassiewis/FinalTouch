package Website.EventRentals.repositories;
import Website.EventRentals.model.ProductReservation;
import Website.EventRentals.model.PrimaryKey;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductReservationRepository extends JpaRepository<ProductReservation, PrimaryKey> {
}
