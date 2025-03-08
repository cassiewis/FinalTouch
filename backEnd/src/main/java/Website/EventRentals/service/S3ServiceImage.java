package Website.EventRentals.service;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.S3Object;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class S3ServiceImage {

    private final S3Client s3Client;
    private final String bucketName = "your-public-bucket-name";

    public S3ServiceImage(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public List<String> getAllImageUrls() {
        ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .build();

        ListObjectsV2Response response = s3Client.listObjectsV2(request);

        return response.contents().stream()
                .map(S3Object::key)
                .map(key -> String.format("https://%s.s3.amazonaws.com/%s", bucketName, key))
                .collect(Collectors.toList());
    }

    public String getImageUrl(String imageKey) {
        return String.format("https://%s.s3.amazonaws.com/%s", bucketName, imageKey);
    }
}