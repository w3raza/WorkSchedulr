package com.project.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class UserDto {
    private UUID id;
    private String firstName;
    private String lastName;
}
