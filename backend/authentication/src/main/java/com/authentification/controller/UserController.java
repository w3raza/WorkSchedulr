package com.authentification.controller;

import com.authentification.dto.LoginRequest;
import com.authentification.dto.UserDataDTO;
import com.authentification.dto.UserResponseDTO;
import com.authentification.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping
  public ResponseEntity<List<String>> test(){
    return ResponseEntity.ok(Arrays.asList("fisrt", "secound"));
  }

  @GetMapping("/refresh")
  @PreAuthorize("hasRole('ROLE_USER')")
  public ResponseEntity<String> refresh(HttpServletRequest req) {
    return ResponseEntity.ok(userService.refresh(req.getRemoteUser()));
  }

  @PostMapping("/signin")
  public ResponseEntity<UserResponseDTO> login(@RequestBody @Valid LoginRequest loginRequest) {
    return ResponseEntity.ok(userService.signin(loginRequest));
  }

  @PostMapping("/signup")
  public ResponseEntity<UserResponseDTO> signup(@RequestBody @Valid UserDataDTO user) {
    return ResponseEntity.ok(userService.signup(user));
  }

  @DeleteMapping(value = "/{username}")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<String> delete(@PathVariable String username) {
    userService.delete(username);
    return ResponseEntity.ok(username);
  }
}
