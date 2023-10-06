package com.authentification.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class RegisterDataDTO {
  private String password;
  private String email;
  private String firstName;
  private String lastName;
  private String phone;
  private LocalDate birth;
}
