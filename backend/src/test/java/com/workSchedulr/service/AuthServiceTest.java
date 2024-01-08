package com.workSchedulr.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

import com.workSchedulr.configuration.JwtService;
import com.workSchedulr.dto.LoginRequest;
import com.workSchedulr.dto.RegisterDataDTO;
import com.workSchedulr.dto.UserResponseDTO;
import com.workSchedulr.exception.InvalidPasswordException;
import com.workSchedulr.exception.UserAlreadyExistsException;
import com.workSchedulr.model.User;
import com.workSchedulr.model.UserRole;
import com.workSchedulr.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.time.LocalDate;
import java.util.Optional;
import java.util.HashSet;
import java.util.Set;

public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    // Test metody refresh
    @Test
    public void whenRefreshToken_thenSuccess() {
        String login = "user@example.com";
        String expectedToken = "token";
        User user = new User();
        user.setEmail(login);
        user.setUserRoles(new HashSet<>(Set.of(UserRole.ROLE_USER)));

        when(userRepository.findByEmail(login)).thenReturn(Optional.of(user));
        when(jwtService.createToken(any(String.class), any(Set.class))).thenReturn(expectedToken);

        String actualToken = authService.refresh(login);

        assertEquals(expectedToken, actualToken);
    }

    // Test metody signOut
    @Test
    public void whenSignOut_thenSuccess() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);

        assertDoesNotThrow(() -> authService.signOut(request, response));
    }

    // Test metody signIn
    @Test
    public void whenSignInWithValidCredentials_thenSuccess() {
        String email = "user@example.com";
        String password = "password";
        String expectedToken = "token";
        LoginRequest loginRequest = new LoginRequest(email, password);
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        UserResponseDTO expectedResponse = new UserResponseDTO();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(CharSequence.class), any(String.class))).thenReturn(true);
        when(jwtService.createToken(any(String.class), any(Set.class))).thenReturn(expectedToken);
        when(modelMapper.map(user, UserResponseDTO.class)).thenReturn(expectedResponse);

        UserResponseDTO actualResponse = authService.signIn(loginRequest);

        assertEquals(expectedToken, actualResponse.getToken());
    }

    @Test
    public void whenSignInWithInvalidPassword_thenThrowException() {
        String email = "user@example.com";
        String password = "password";
        LoginRequest loginRequest = new LoginRequest(email, password);
        User user = new User();
        user.setEmail(email);
        user.setPassword("differentPassword");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(CharSequence.class), any(String.class))).thenReturn(false);

        assertThrows(InvalidPasswordException.class, () -> authService.signIn(loginRequest));
    }

    // Test metody signup
    @Test
    public void whenSignupWithNewEmail_thenSuccess() {
        RegisterDataDTO newUserDTO = new RegisterDataDTO();
        newUserDTO.setEmail("newuser@example.com");
        newUserDTO.setPassword("password");
        newUserDTO.setFirstName("test");
        newUserDTO.setLastName("testowski");
        newUserDTO.setPhone("111111111");
        newUserDTO.setBirth(LocalDate.now());
        User user = new User();
        user.setEmail(newUserDTO.getEmail());
        UserResponseDTO expectedResponse = new UserResponseDTO();

        when(userRepository.existsByEmail(newUserDTO.getEmail())).thenReturn(false);
        when(modelMapper.map(newUserDTO, User.class)).thenReturn(user);
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(modelMapper.map(user, UserResponseDTO.class)).thenReturn(expectedResponse);
        when(jwtService.createToken(any(String.class), any(Set.class))).thenReturn("token");

        UserResponseDTO actualResponse = authService.signup(newUserDTO);

        assertNotNull(actualResponse);
    }

    @Test
    public void whenSignupWithExistingEmail_thenThrowException() {
        RegisterDataDTO newUserDTO = new RegisterDataDTO();
        newUserDTO.setEmail("existinguser@example.com");
        newUserDTO.setPassword("password");

        when(userRepository.existsByEmail(newUserDTO.getEmail())).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> authService.signup(newUserDTO));
    }
}
