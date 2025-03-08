package Website.EventRentals.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.s3.S3Client;


@Configuration
public class AwsConfig {

    @Value("${aws.region}")
    private String region;

    @Bean
    public S3Client generalS3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(ProfileCredentialsProvider.builder()
                        .profileName("general")
                        .build())
                .build();
    }

    @Bean
    public DynamoDbClient generalDynamoDbClient() {
        return DynamoDbClient.builder()
                .region(Region.of(region))
                .credentialsProvider(ProfileCredentialsProvider.builder()
                        .profileName("general")
                        .build())
                .build();
    }

    @Bean
    public DynamoDbEnhancedClient generalDynamoDbEnhancedClient(DynamoDbClient generalDynamoDbClient) {
        return DynamoDbEnhancedClient.builder()
                .dynamoDbClient(generalDynamoDbClient)
                .build();
    }

    @Bean
    public S3Client adminS3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(ProfileCredentialsProvider.builder()
                        .profileName("admin")
                        .build())
                .build();
    }

    @Bean
    public DynamoDbClient adminDynamoDbClient() {
        return DynamoDbClient.builder()
                .region(Region.of(region))
                .credentialsProvider(ProfileCredentialsProvider.builder()
                        .profileName("admin")
                        .build())
                .build();
    }

    @Bean
    public DynamoDbEnhancedClient adminDynamoDbEnhancedClient(DynamoDbClient adminDynamoDbClient) {
        return DynamoDbEnhancedClient.builder()
                .dynamoDbClient(adminDynamoDbClient)
                .build();
    }
}
