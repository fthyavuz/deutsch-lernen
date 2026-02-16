package com.fatih.germanapp.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.*;

import com.fatih.germanapp.dto.UserResponseDTO;
import com.fatih.germanapp.dto.Role;
import com.fatih.germanapp.model.User;
import com.fatih.germanapp.repository.UserRepository;
import com.fatih.germanapp.exception.ResourceNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        log.info("Admin fetching all users");
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/role")
    public UserResponseDTO updateUserRole(@PathVariable Long id, @RequestParam Role role) {
        log.info("Admin updating role for user id: {} to {}", id, role);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(role);
        return convertToDTO(userRepository.save(user));
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        log.info("Admin deleting user id: {}", id);
        // Cascading deletion is handled by the OneToMany relationship in User entity
        userRepository.deleteById(id);
    }

    private UserResponseDTO convertToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
