package com.fatih.germanapp.config;

import com.fatih.germanapp.dto.Role;
import com.fatih.germanapp.model.User;
import com.fatih.germanapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("--------------------------------------");
            System.out.println("Admin user created: admin@example.com / admin123");
            System.out.println("--------------------------------------");
        } else {
            System.out.println("Admin user already exists. Skipping creation.");
        }
    }
}
