package Website.EventRentals.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import Website.EventRentals.model.Product;
import Website.EventRentals.service.AdminS3ServiceProduct;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE })
public class AdminProductController {

    private final AdminS3ServiceProduct adminS3ServiceProduct;

    @Autowired
    public AdminProductController(AdminS3ServiceProduct adminS3ServiceProduct) {
        this.adminS3ServiceProduct = adminS3ServiceProduct;
    }

    // Endpoint for fetching a single product by ID
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/{productId}")
    public ResponseEntity<?> getProduct(@PathVariable String productId) {
        try {
            Product product = adminS3ServiceProduct.getProduct(productId);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint for fetching all products
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Product>> getProducts() {
        try {
            List<Product> products = adminS3ServiceProduct.getProducts();
            return ResponseEntity.ok(products);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Endpoint for uploading a product (admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Product> uploadProduct(@RequestBody Product product) {
        try {
            Product uploadedProduct = adminS3ServiceProduct.uploadProduct(product);
            return ResponseEntity.ok(uploadedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Endpoint for updating a product (admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(@PathVariable String productId, @RequestBody Product product) {
        try {
            Product updatedProduct = adminS3ServiceProduct.updateProduct(productId, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Method to delete a product by ID from S3
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable String productId) {
        try {
            adminS3ServiceProduct.deleteProduct(productId);
            return ResponseEntity.ok("Product deleted successfully from S3");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting product from S3: " + e.getMessage());
        }
    }
}
