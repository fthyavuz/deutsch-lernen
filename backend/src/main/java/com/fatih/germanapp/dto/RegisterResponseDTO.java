package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@lombok.Data
@Getter
@Setter
public class RegisterResponseDTO {
    private Long id;
    private String email;
    private String role;

    public RegisterResponseDTO(Long id, String email, String role) {
        this.id = id;
        this.email = email;
        this.role = role;
    }
}
