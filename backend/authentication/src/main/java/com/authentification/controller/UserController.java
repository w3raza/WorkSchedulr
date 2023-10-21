package com.authentification.controller;

import com.authentification.dto.UserUpdateDTO;
import com.authentification.model.User;
import com.authentification.service.UserService;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

  private final UserService userService;

  @GetMapping("{userId}")
  @PreAuthorize("hasRole('ROLE_USER')")
  public ResponseEntity<User> getUserById(@PathVariable("userId") UUID userId){
    return ResponseEntity.ok(userService.getUserById(userId));
  }

  @GetMapping()
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<Page<User>> getUsersByParams(Pageable pageable,
                                                     @Nullable @RequestParam String role,
                                                     @Nullable @RequestParam Boolean status){
    return ResponseEntity.ok(userService.getUsersByParams(pageable, role, status));
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasRole('ROLE_USER')")
  public ResponseEntity<User> updateUser(@PathVariable UUID id, @RequestBody UserUpdateDTO dto) {
    User updatedUser = userService.updateUser(id, dto);
    return ResponseEntity.ok(updatedUser);
  }

  @PatchMapping("/status/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<User> changeStatus(@PathVariable UUID id) {
    User updatedUser = userService.changeStatus(id);
    return ResponseEntity.ok(updatedUser);
  }

  @DeleteMapping(value = "/{email}")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<String> delete(@PathVariable String email) {
    userService.delete(email);
    return ResponseEntity.ok("Delete user with email: " + email);
  }
}
