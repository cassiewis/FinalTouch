package Website.EventRentals.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import Website.EventRentals.model.ApiResponse;
import Website.EventRentals.model.Review;
import Website.EventRentals.service.S3ServiceDetails;

@RestController
@RequestMapping("/api/details")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST })
public class DetailsController {

    private final S3ServiceDetails s3ServiceDetails;

    @Autowired
    public DetailsController(S3ServiceDetails s3ServiceDetails) {
        this.s3ServiceDetails = s3ServiceDetails;
    }

    // Endpoint for filtering products by IDs
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<Review>>> getAllReviews() {
        System.out.println("CASSIE getAllReviews hit in controller");
        try {
            List<Review> reviews = s3ServiceDetails.getAllReviews();
            return ResponseEntity.ok(new ApiResponse<>(true, reviews, "Reviews retrieved successfully"));
        } catch (IllegalArgumentException e) { // Client-side error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, null, e.getMessage()));
        } catch (Exception e) { // Server-side error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, null, "An unexpected error occurred: " + e.getMessage()));
        }
    }
}