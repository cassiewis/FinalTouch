package Website.EventRentals;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
// import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
@ComponentScan(basePackages = {"Website.EventRentals.config"})
// @EnableJpaRepositories(basePackages = "Website.EventRentals.repositories")
// @EntityScan(basePackages = "Website.EventRentals.model")
public class EventRentalsApplication {
    public static void main(String[] args) {
        SpringApplication.run(EventRentalsApplication.class, args);
    }
}