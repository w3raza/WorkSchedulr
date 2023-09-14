package com.authentification.dto;

import com.authentification.model.UserRole;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class UserResponseDTO {
  private UUID id;
  private String username;
  private String email;
  Set<UserRole> userRoles;
  private String token;
}
