package Website.EventRentals.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import Website.EventRentals.service.S3ServiceImage;

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

    // Endpoint for fetching inspo image URLs
    @GetMapping("/inspo")
    public ResponseEntity<List<String>> getInspoImageUrls() {
        try {
            List<String> imageUrls = s3ServiceImage.getInspoImageUrls();
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