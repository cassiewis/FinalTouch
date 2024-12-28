package Website.EventRentals.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

public class PrimaryKey implements Serializable {
    private String productId;
    private LocalDate date;

    // Default constructor
    public PrimaryKey() {}

    public PrimaryKey(String productId, LocalDate date) {
        this.productId = productId;
        this.date = date;
    }

    // Getters and setters
    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    // equals() and hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PrimaryKey that = (PrimaryKey) o;
        return Objects.equals(productId, that.productId) && Objects.equals(date, that.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, date);
    }
}
