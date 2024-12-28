package Website.EventRentals;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

// @SpringBootApplication(scanBasePackages = "Website.EventRentals")
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class}, scanBasePackages = "Website.EventRentals")
@EnableJpaRepositories(basePackages = "Website.EventRentals.repositories")
@EntityScan(basePackages = "Website.EventRentals.model")
public class EventRentalsApplication {
    public static void main(String[] args) {
        SpringApplication.run(EventRentalsApplication.class, args);
    }
}