package com.fatih.germanapp.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fatih.germanapp.dto.LoginRequestDTO;
import com.fatih.germanapp.dto.LoginResponseDTO;
import com.fatih.germanapp.model.User;
import com.fatih.germanapp.repository.UserRepository;
import com.fatih.germanapp.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;
        private final UserRepository userRepository;

        public AuthController(AuthenticationManager authenticationManager,
                        JwtUtil jwtUtil,
                        UserRepository userRepository) {
                this.authenticationManager = authenticationManager;
                this.jwtUtil = jwtUtil;
                this.userRepository = userRepository;
        }

        @PostMapping("/login")
        public LoginResponseDTO login(@RequestBody LoginRequestDTO request) {
                System.out.println("Login request: " + request);

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                String token = jwtUtil.generateToken(
                                user.getEmail(),
                                user.getRole().name());

                return new LoginResponseDTO(token);
        }
}
