package com.authentification.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserUpdateDTO {
    @Size(min = 8, message = "Minimum password length: 8 characters")
    private String password;

    @Size(min = 4, max = 255, message = "Minimum username length: 4 characters")
    private String email;

    @Size(min = 2, message = "Minimum first name length: 2 characters")
    private String firstName;

    @Size(min = 2, message = "Minimum last name length: 2 characters")
    private String lastName;

    @Size(min = 9, message = "Minimum phone length: 9 characters")
    private String phone;

    private LocalDate birth;

    private boolean isStudent;
}
