package Website.EventRentals.service;

import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

import org.springframework.stereotype.Service;

import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;

@Service
public class AdminAuthenticationService {

    private static final String SECRET_NAME = "application/login/credentials";

    public boolean authenticate(String username, String password) {
        Map<String, String> adminCredentials = getAdminCredentials();

        String storedUsername = adminCredentials.get("username");
        String storedPassword = adminCredentials.get("password");

        // Validate username and password
        return username.equals(storedUsername) && password.equals(storedPassword);
    }

    public Map<String, String> getAdminCredentials() {
        SecretsManagerClient secretsManagerClient = SecretsManagerClient.builder()
                .credentialsProvider(ProfileCredentialsProvider.create("general"))
                .region(software.amazon.awssdk.regions.Region.US_EAST_2)
                .build();

        GetSecretValueRequest getSecretValueRequest = GetSecretValueRequest.builder()
                .secretId(SECRET_NAME)
                .build();

        GetSecretValueResponse getSecretValueResponse = secretsManagerClient.getSecretValue(getSecretValueRequest);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(getSecretValueResponse.secretString(), Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse secret", e);
        }
    }
}
