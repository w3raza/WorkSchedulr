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

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

  private final UserService userService;

  @GetMapping("/me")
  @PreAuthorize("hasRole('ROLE_USER')")
  public ResponseEntity<User> getCurrentUser(){
    return ResponseEntity.ok(userService.getCurrentUser());
  }

  @GetMapping("{userId}")
  @PreAuthorize("hasRole('ROLE_USER')")
  public ResponseEntity<User> getUserById(@NotNull @PathVariable("userId") UUID userId){
    return ResponseEntity.ok(userService.getUserById(userId));
  }

  @GetMapping()
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<Page<User>> getUsersByParams(Pageable pageable,
                                                     @Nullable @RequestParam String role,
                                                     @Nullable @RequestParam Boolean status){
    return ResponseEntity.ok(userService.getUsersByParams(role, status, pageable));
  }

  @GetMapping("/all")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<Set<User>> getUsers(){
    return ResponseEntity.ok(userService.getAllUser());
  }

  @PostMapping()
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<User> createUser(@NotNull @RequestBody User user) {
    user = userService.createUser(user);
    return ResponseEntity.ok(user);
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasRole('ROLE_USER')")
  public ResponseEntity<User> updateUser(@NotNull @PathVariable UUID id, @NotNull @RequestBody UserUpdateDTO dto) {
    User updatedUser = userService.updateUser(id, dto);
    return ResponseEntity.ok(updatedUser);
  }

  @PatchMapping("/status/{id}")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<User> changeStatus(@NotNull @PathVariable UUID id) {
    User updatedUser = userService.changeStatus(id);
    return ResponseEntity.ok(updatedUser);
  }

  @DeleteMapping()
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<String> delete(@NotNull @RequestParam String email) {
    userService.delete(email);
    return ResponseEntity.ok("Delete user with email: " + email);
  }
}
