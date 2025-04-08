package Website.EventRentals.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import Website.EventRentals.service.DynamoDbReservedDateService;
import Website.EventRentals.shared.model.ReservedDate;

@RestController
@RequestMapping("/api/reservedDates")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET})
public class ReservedDateController {

    private final DynamoDbReservedDateService dynamoDbReservedDateService;

    @Autowired
    public ReservedDateController(DynamoDbReservedDateService dynamoDbReservedDateService) {
        this.dynamoDbReservedDateService = dynamoDbReservedDateService;
    }

    @GetMapping
    public List<ReservedDate> getAllReservedDates() {
        return dynamoDbReservedDateService.getAllReservedDates();
    }

    @GetMapping("/availableProductIds/{date}")
    // Endpoint to get all available product IDs for a specific date
    public List<String> getAvailableProductIdsByDate(String date) {
        return dynamoDbReservedDateService.getAvailableProductIdsByDate(date);
    }

    @GetMapping("/dates/{productId}")
    // Endpoint to get all reserved dates for a specific product ID
    public List<String> getDatesByProductId(@PathVariable String productId) {
        System.out.println("CASSIE getDatesByProductId productId: " + productId);
        return dynamoDbReservedDateService.getDatesByProductId(productId);
    }
}
