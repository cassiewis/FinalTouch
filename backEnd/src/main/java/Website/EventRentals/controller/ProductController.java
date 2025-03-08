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

import Website.EventRentals.model.Product;
import Website.EventRentals.service.S3ServiceProduct;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = { RequestMethod.GET })
public class ProductController {

    private final S3ServiceProduct s3ServiceProduct;

    @Autowired
    public ProductController(S3ServiceProduct s3ServiceProduct) {
        this.s3ServiceProduct = s3ServiceProduct;

    }

    // Endpoint for fetching a single product by ID
    @GetMapping("/{productId}")
    public ResponseEntity<?> getActiveProduct(@PathVariable String productId) {
        try {
            Product product = s3ServiceProduct.getActiveProduct(productId);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint for fetching all customer facing products
    @GetMapping
    public ResponseEntity<List<Product>> getActiveProducts() {
        try {
            List<Product> products = s3ServiceProduct.getActiveProducts();
            return ResponseEntity.ok(products);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

}
