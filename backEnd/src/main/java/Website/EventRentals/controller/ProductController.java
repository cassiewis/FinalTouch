package Website.EventRentals.controller;

import Website.EventRentals.model.Product;
import Website.EventRentals.service.S3ServiceProduct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE })
public class ProductController {

    private final S3ServiceProduct s3ServiceProduct;

    @Autowired
    public ProductController(S3ServiceProduct s3ServiceProduct) {
        this.s3ServiceProduct = s3ServiceProduct;
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Controller is working");
    }

    // Endpoint for uploading a product
    @PostMapping
    public ResponseEntity<Product> uploadProduct(@RequestBody Product product) {
        try {
            // Upload product to S3 and get the product back with updated details (like S3 key)
            Product uploadedProduct = s3ServiceProduct.uploadProduct(product);
            // Return the uploaded product with a status of CREATED (HTTP 201)
            return ResponseEntity.status(201).body(uploadedProduct);
        } catch (Exception e) {
            // Return error message with a BAD REQUEST status (HTTP 400)
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Endpoint for fetching all products
    @GetMapping
    public ResponseEntity<List<Product>> getProducts() {
        try {
            List<Product> products = s3ServiceProduct.getProducts();
            return ResponseEntity.ok(products);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Endpoint for fetching a single product by ID
    @GetMapping("/{productId}")
    public ResponseEntity<?> getProduct(@PathVariable String productId) {
        try {
            Product product = s3ServiceProduct.getProduct(productId);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint for updating a product
    @PutMapping("/{productId}")
    public ResponseEntity<String> updateProduct(@PathVariable String productId, @RequestBody Product updatedProduct) {
        try {
            String message = s3ServiceProduct.updateProduct(productId, updatedProduct);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error updating product: " + e.getMessage());
        }
    }

    // Method to delete a product by ID from S3
    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable String productId) {
        try {
            s3ServiceProduct.deleteProduct(productId);
            return ResponseEntity.ok("Product deleted successfully from S3");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting product from S3: " + e.getMessage());
        }
    }
}
