package com.fatih.germanapp.config;

import com.fatih.germanapp.dto.Role;
import com.fatih.germanapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.fatih.germanapp.repository.LevelRepository levelRepository;
    private final com.fatih.germanapp.repository.LessonRepository lessonRepository;

    public DataInitializer(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            com.fatih.germanapp.repository.LevelRepository levelRepository,
            com.fatih.germanapp.repository.LessonRepository lessonRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.levelRepository = levelRepository;
        this.lessonRepository = lessonRepository;
    }

    @Override
    public void run(String... args) {
        // Initialize Admin User
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            com.fatih.germanapp.model.User admin = new com.fatih.germanapp.model.User();
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("Admin user created: admin@example.com / admin123");
        }

        // Initialize Levels (A1.1 through C1.2)
        String[][] levelsData = {
                { "A1.1", "Beginner I", "Starting your German journey.", "1" },
                { "A1.2", "Beginner II", "Expanding your basic knowledge.", "2" },
                { "A2.1", "Elementary I", "Basic communication in everyday situations.", "3" },
                { "A2.2", "Elementary II", "Consolidating elementary German.", "4" },
                { "B1.1", "Intermediate I", "Advancing towards independent language use.", "5" },
                { "B1.2", "Intermediate II", "Strengthening intermediate skills.", "6" },
                { "B2.1", "Upper Intermediate I", "Independent language use in professional contexts.", "7" },
                { "B2.2", "Upper Intermediate II", "Advanced independent communication.", "8" },
                { "C1.1", "Advanced I", "Effective operational proficiency.", "9" },
                { "C1.2", "Advanced II", "Approaching native-level fluency.", "10" }
        };

        com.fatih.germanapp.model.Level a11Level = levelRepository.findByCode("A1.1").orElse(null);

        for (String[] data : levelsData) {
            String code = data[0];
            if (levelRepository.findByCode(code).isEmpty()) {
                com.fatih.germanapp.model.Level level = new com.fatih.germanapp.model.Level();
                level.setCode(code);
                level.setTitle(data[1]);
                level.setDescription(data[2]);
                level.setDisplayOrder(Integer.parseInt(data[3]));
                levelRepository.save(level);
                System.out.println("Created Level: " + code);
                if (code.equals("A1.1")) {
                    a11Level = level;
                }
            }
        }

        // Assign existing lessons to A1.1 if they don't have a level
        if (a11Level != null) {
            java.util.List<com.fatih.germanapp.model.Lesson> lessons = lessonRepository.findAll();
            int count = 0;
            for (com.fatih.germanapp.model.Lesson lesson : lessons) {
                if (lesson.getLevel() == null) {
                    lesson.setLevel(a11Level);
                    lessonRepository.save(lesson);
                    count++;
                }
            }
            if (count > 0) {
                System.out.println("Assigned " + count + " existing lessons to A1.1");
            }
        }
    }
}
