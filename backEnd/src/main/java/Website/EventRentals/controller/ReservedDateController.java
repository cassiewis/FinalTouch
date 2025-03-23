package Website.EventRentals.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import Website.EventRentals.model.ReservedDate;
import Website.EventRentals.service.DynamoDbReservedDateService;

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
}
