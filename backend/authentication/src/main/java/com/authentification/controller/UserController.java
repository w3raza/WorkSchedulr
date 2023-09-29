package com.authentification.controller;

import com.authentification.dto.LoginRequest;
import com.authentification.dto.RegisterDataDTO;
import com.authentification.dto.UserResponseDTO;
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

  @GetMapping("/signout")
  public void signout(HttpServletRequest request, HttpServletResponse response) {
     userService.signout(request, response);
  }

  @PostMapping("/signin")
  public ResponseEntity<UserResponseDTO> signin(@RequestBody @Valid LoginRequest loginRequest) {
    return ResponseEntity.ok(userService.signin(loginRequest));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody @Valid RegisterDataDTO user) {
    try {
      UserResponseDTO response = userService.signup(user);
      return new ResponseEntity<>(response, HttpStatus.CREATED);
    } catch (ResponseStatusException e) {
      return new ResponseEntity<>(e.getReason(), e.getStatusCode());
    }
  }

  @DeleteMapping(value = "/{username}")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<String> delete(@PathVariable String username) {
    userService.delete(username);
    return ResponseEntity.ok(username);
  }
}
