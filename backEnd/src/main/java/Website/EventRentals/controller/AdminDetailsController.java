package Website.EventRentals.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import Website.EventRentals.model.ApiResponse;
import Website.EventRentals.model.Review;
import Website.EventRentals.service.AdminS3ServiceDetails;

@RestController
@RequestMapping("/api/admin/details")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST })
public class AdminDetailsController {

    private final AdminS3ServiceDetails adminS3ServiceDetails;

    @Autowired
    public AdminDetailsController(AdminS3ServiceDetails adminS3ServiceDetails) {
        this.adminS3ServiceDetails = adminS3ServiceDetails;
    }

    @PreAuthorize("hasRole('Admin')")
    @PostMapping("/reviews")
    public ResponseEntity<ApiResponse<Review>> addReview(@RequestBody Review review) {
        System.out.println("CASSIE addReview hit in controller");
        try {
            adminS3ServiceDetails.addReview(review);
            return ResponseEntity.ok(new ApiResponse<>(true, review, "Review added successfully"));
        } catch (IllegalArgumentException e) { // Client-side error
            System.out.println("CASSIE illegalArgumentError error: " + e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, null, e.getMessage()));
        } catch (Exception e) { // Server-side error
            System.out.println("CASSIE exception: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, null, "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/reviews/{id}>")
    public ResponseEntity<ApiResponse<String>> removeReview(@RequestBody String reviewId) {
        System.out.println("CASSIE removeReview hit in controller");
        try {
            adminS3ServiceDetails.removeReview(reviewId);
            return ResponseEntity.ok(new ApiResponse<>(true, reviewId, "Review removed successfully"));
        } catch (IllegalArgumentException e) { // Client-side error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, null, e.getMessage()));
        } catch (Exception e) { // Server-side error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, null, "An unexpected error occurred: " + e.getMessage()));
        }
    }
}