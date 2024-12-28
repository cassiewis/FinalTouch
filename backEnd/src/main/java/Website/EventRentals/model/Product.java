package Website.EventRentals.model;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Product {
    private String productId;
    private boolean active;
    private String name;
    private double price;
    private double deposit;
    private String description;
    private String imageUrl; // Store the S3 URL for the image
    @JsonFormat(pattern = "yyyy-MM-dd")
    private List<LocalDate> datesReserved;

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getDeposit() {
        return deposit;
    }

    public void setDeposit(double deposit) {
        this.deposit = deposit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<LocalDate> getDatesReserved () {
        return datesReserved;
    }

    public void setDatesReserved (List<LocalDate> reservedDates) {
        this.datesReserved = reservedDates;
    }
}