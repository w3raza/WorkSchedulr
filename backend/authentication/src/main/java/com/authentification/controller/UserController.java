package com.authentification.controller;

import com.authentification.dto.LoginRequest;
import com.authentification.dto.RegisterDataDTO;
import com.authentification.dto.UserResponseDTO;
import com.authentification.dto.UserUpdateDTO;
import com.authentification.model.User;
import com.authentification.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

  private final UserService userService;

  @GetMapping("{userId}")
  public ResponseEntity<User> getUserById(@PathVariable("userId") UUID userId){
    return ResponseEntity.ok(userService.getUserById(userId));
  }

  @PatchMapping("/{id}")
  public ResponseEntity<User> updateUser(@PathVariable UUID id, @RequestBody UserUpdateDTO dto) {
    User updatedUser = userService.updateUser(id, dto);
    return ResponseEntity.ok(updatedUser);
  }

  @DeleteMapping(value = "/{email}")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<String> delete(@PathVariable String email) {
    userService.delete(email);
    return ResponseEntity.ok("Delete user with email: " + email);
  }
}
