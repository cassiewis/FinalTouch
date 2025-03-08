package Website.EventRentals.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Website.EventRentals.service.S3ServiceImage;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET })
public class ImageS3Controller {

    private final S3ServiceImage s3ServiceImage;

    @Autowired
    public ImageS3Controller(S3ServiceImage s3ServiceImage) {
        this.s3ServiceImage = s3ServiceImage;
    }

    // Endpoint for fetching all image URLs
    @GetMapping
    public ResponseEntity<List<String>> getAllImageUrls() {
        try {
            List<String> imageUrls = s3ServiceImage.getAllImageUrls();
            return ResponseEntity.ok(imageUrls);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Endpoint for fetching a single image URL by key
    @GetMapping("/{imageKey}")
    public ResponseEntity<String> getImageUrl(@PathVariable String imageKey) {
        try {
            String imageUrl = s3ServiceImage.getImageUrl(imageKey);
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}