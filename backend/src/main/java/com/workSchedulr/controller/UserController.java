package com.workSchedulr.controller;

import com.workSchedulr.dto.UserUpdateDTO;
import com.workSchedulr.model.User;
import com.workSchedulr.service.UserService;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
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
    return ResponseEntity.ok(userService.getUsersByParams(role, status, pageable));
  }

  @PostMapping()
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<User> createUser(@RequestBody User user) {
    user = userService.createUser(user);
    return ResponseEntity.ok(user);
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
