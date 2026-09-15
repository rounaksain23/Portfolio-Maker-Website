package com.portfolio.config;

import com.portfolio.model.Role;
import com.portfolio.model.User;
import com.portfolio.model.UserStatus;
import com.portfolio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@portfolio.com").isEmpty()) {
            User admin = new User(
                    "Super Admin",
                    "admin@portfolio.com",
                    passwordEncoder.encode("admin123"),
                    Role.SUPERADMIN,
                    UserStatus.ACTIVE
            );
            userRepository.save(admin);
            System.out.println(">>> SEEDED INITIAL SUPERADMIN: admin@portfolio.com / admin123 <<<");
        }
    }
}
