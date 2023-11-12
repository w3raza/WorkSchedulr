package com.workSchedulr.dto;

import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class ProjectDTO {
    private UUID id;
    private String title;
    private Integer hours;
    private boolean status;
    private UserDTO owner;
    private Set<UserDTO> managers;
    private Set<UserDTO> users;
}
