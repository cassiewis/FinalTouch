package Website.EventRentals.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import Website.EventRentals.model.Reservation;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.S3Object;

@Service
public class AdminS3ServiceReservation {
    private final S3Client s3Client;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    private final String bucketName = "reservations-bucket-final-touch";

    public AdminS3ServiceReservation(@Qualifier("adminS3Client") S3Client adminS3Client) {
        this.s3Client = adminS3Client;
    }

    // Fetch all reservations from S3
    public List<Reservation> getReservations() {
        try {
            ListObjectsV2Request listObjectsV2Request = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .build();

            List<Reservation> reservations = s3Client.listObjectsV2(listObjectsV2Request).contents()
                    .stream()
                    .map(this::getReservationFromObject)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            return reservations;
        } catch (S3Exception e) {
            throw new RuntimeException("Error fetching products from S3: " + e.awsErrorDetails().errorMessage(), e);
        }
    }


    // Fetches all reservations from S3 that are active, pending, or fulfilled
    public List<Reservation> getActiveReservations() {
        try {
            ListObjectsV2Request listObjectsV2Request = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .build();
        
            List<Reservation> reservations = s3Client.listObjectsV2(listObjectsV2Request).contents()
                    .stream()
                    .map(this::getReservationFromObject)
                    .filter(reservation -> reservation != null && 
                            (reservation.getStatus().equals("active") || 
                            reservation.getStatus().equals("pending") || 
                            reservation.getStatus().equals("fulfilled")))
                    .collect(Collectors.toList());
            return reservations;
        } catch (S3Exception e) {
            throw new RuntimeException("Error fetching products from S3: " + e.awsErrorDetails().errorMessage(), e);
        }
    }

    // Fetches and converts a single reservation from S3 by ID
    public Reservation getReservation(String reservationId) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(reservationId + ".json")
                .build();

        try (ResponseInputStream<GetObjectResponse> s3ObjectStream = s3Client.getObject(getObjectRequest)) {
            String reservationJson = new String(s3ObjectStream.readAllBytes(), StandardCharsets.UTF_8);
            return mapToReservation(reservationJson);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching reservation from S3 for ID: " + reservationId, e);
        }
    }

    // Converts reservation object to JSON
    private String reservationToJson(Reservation reservation) {
        try {
            return objectMapper.writeValueAsString(reservation);
        } catch (Exception e) {
            throw new RuntimeException("Error converting Reservation to JSON", e);
        }
    }

    // Converts JSON string to reservation object
    public Reservation mapToReservation(String reservationJson) {
        try {
            return objectMapper.readValue(reservationJson, Reservation.class);
        } catch (Exception e) {
            throw new RuntimeException("Error converting JSON to Reservation", e);
        }
    }

    // Helper method to fetch the JSON string from S3 and map it to a reservation object
    private Reservation getReservationFromObject(S3Object s3Object) {
        String key = s3Object.key();
        try {
            return getReservation(key.replace(".json", ""));
        } catch (RuntimeException e) {
            System.err.println("Error fetching reservation for key: " + key + ", Error: " + e.getMessage());
            return null;
        }
    }

    // Update an existing reservation in S3
    public String updateReservation(String reservationId, Reservation updatedReservation) {
        if (!reservationId.equals(updatedReservation.getReservationId())) {
            throw new IllegalArgumentException("Reservation ID in the URL and request body must match.");
        }

        String key = reservationId + ".json";
        String reservationJson = reservationToJson(updatedReservation);

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build(),
                RequestBody.fromString(reservationJson)
        );

        System.out.println("Reservation updated successfully in S3 for key: " + key);
        return key;
    }

    // Method to delete a reservation from S3 using its reservationId
    public void deleteReservation(String reservationId) {
        String key = reservationId + ".json"; // Assuming the reservation is stored with a key that ends in ".json"

        try {
            // Deleting the object from S3
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            System.out.println("Successfully deleted reservation with ID: " + reservationId);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting reservation from S3: " + e.getMessage(), e);
        }
    }

    private String getObjectContent(S3Object s3Object) {
        try (ResponseInputStream<GetObjectResponse> inputStream = s3Client.getObject(GetObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Object.key())
                .build())) {
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            // Handle the IOException (e.g., log the error, rethrow it, etc.)
            throw new RuntimeException("Error reading content from S3", e);
        }
    }

}
