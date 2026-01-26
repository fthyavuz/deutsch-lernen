
package com.fatih.germanapp.dto;

import lombok.Getter;
import lombok.Setter;

@lombok.Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
@Getter
@Setter
public class LoginRequestDTO {
    private String email;
    private String password;
}
