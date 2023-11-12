package com.workSchedulr.model;

import org.springframework.security.core.GrantedAuthority;

public enum UserRole implements GrantedAuthority {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_CLIENT,
  ROLE_USER;

  public String getAuthority() {
    return name();
  }
}
