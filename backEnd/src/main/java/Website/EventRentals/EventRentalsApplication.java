package Website.EventRentals;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@ComponentScan(basePackages = "Website.EventRentals")
public class EventRentalsApplication {
    public static void main(String[] args) {
        SpringApplication.run(EventRentalsApplication.class, args);
    }
}