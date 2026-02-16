package com.fatih.germanapp.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String email;
    private Role role;
    private LocalDateTime createdAt;
}
