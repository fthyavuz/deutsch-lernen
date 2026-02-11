package com.fatih.germanapp.controller;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatih.germanapp.dto.LoginRequestDTO;
import com.fatih.germanapp.dto.LoginResponseDTO;
import com.fatih.germanapp.dto.RegisterRequestDTO;
import com.fatih.germanapp.dto.RegisterResponseDTO;
import com.fatih.germanapp.dto.Role;
import com.fatih.germanapp.model.User;
import com.fatih.germanapp.repository.UserRepository;
import com.fatih.germanapp.security.JwtUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        public AuthController(AuthenticationManager authenticationManager,
                        JwtUtil jwtUtil,
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder) {
                this.authenticationManager = authenticationManager;
                this.jwtUtil = jwtUtil;
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @PostMapping("/login")
        public LoginResponseDTO login(@RequestBody LoginRequestDTO request) {

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                String token = jwtUtil.generateToken(
                                user.getEmail(),
                                user.getRole().name());
                Role role = user.getRole();
                log.info("User logged in successfully: {}", user.getEmail());
                return new LoginResponseDTO(token, role, user.getEmail());
        }

        @PostMapping("/register")
        public RegisterResponseDTO register(
                        @RequestBody RegisterRequestDTO request) {

                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                        throw new RuntimeException("Email already registered");
                }

                User user = new User();
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setRole(Role.STUDENT);
                user.setCreatedAt(LocalDateTime.now());

                User savedUser = userRepository.save(user);

                String token = jwtUtil.generateToken(
                                savedUser.getEmail(),
                                savedUser.getRole().name());

                log.info("New user registered successfully: {}", savedUser.getEmail());

                return new RegisterResponseDTO(
                                savedUser.getId(),
                                savedUser.getEmail(),
                                savedUser.getRole(),
                                token);
        }
}
