package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@lombok.Data
@Getter
@Setter
public class RegisterResponseDTO {
    private Long id;
    private String email;
    private Role role;
    private String token;

    public RegisterResponseDTO(Long id, String email, Role role, String token) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.token = token;
    }
}
