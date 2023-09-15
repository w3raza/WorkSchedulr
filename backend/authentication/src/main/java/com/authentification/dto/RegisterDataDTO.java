package com.authentification.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class RegisterDataDTO {
  private String username;
  private String password;
  private String email;
  private String firstName;
  private String lastName;
  private String phone;
  private String country;
  private LocalDate birth;
}
