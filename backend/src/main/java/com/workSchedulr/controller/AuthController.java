package com.workSchedulr.controller;

import com.workSchedulr.dto.LoginRequest;
import com.workSchedulr.dto.RegisterDataDTO;
import com.workSchedulr.dto.UserResponseDTO;
import com.workSchedulr.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @GetMapping("/refresh")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<String> refresh(HttpServletRequest req) {
        return ResponseEntity.ok(authService.refresh(req.getRemoteUser()));
    }

    @GetMapping("/signout")
    @ResponseStatus(HttpStatus.OK)
    public void signout(HttpServletRequest request, HttpServletResponse response) {
        authService.signOut(request, response);
    }

    @PostMapping("/signin")
    public ResponseEntity<UserResponseDTO> signin(@RequestBody @Valid LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.signIn(loginRequest));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid RegisterDataDTO user) {
        try {
            UserResponseDTO response = authService.signup(user);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatusCode());
        }
    }
}
