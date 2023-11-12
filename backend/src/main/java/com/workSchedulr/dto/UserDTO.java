package com.workSchedulr.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Data
public class UserDTO {
    private UUID id;
    private String firstName;
    private String lastName;
    private String phone;
    private LocalDate birth;
    private boolean isStudent;
    private boolean status;
    Set<String> userRoles;
}
