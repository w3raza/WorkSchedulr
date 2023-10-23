package com.workSchedulr.dto;

import com.workSchedulr.model.UserRole;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class UserResponseDTO {
  private UUID id;
  private String email;
  Set<UserRole> userRoles;
  private String token;
}
